import { PrismaClient } from "../../generated/prisma/client";
import {
  NotFoundError,
  ValidationError,
} from "../../shared/utils/error_util";
import { PublishResultsResult } from "./session_type";

export class SessionService {
  public constructor(
    private readonly prisma: PrismaClient,
  ) {}

  public publish_results = async (
    session_id: string,
    user_id: string,
  ): Promise<PublishResultsResult> => {
    const existing_session =
      await this.prisma.votingSession.findUnique({
        where: { id: session_id },
      });

    if (!existing_session)
      throw new NotFoundError("Voting session not found");

    if (existing_session.is_published)
      throw new ValidationError(
        "Results already published",
      );

    const vote_counts =
      await this.prisma.voteRecord.groupBy({
        by: ["candidate_id"],
        where: { session_id },
        _count: { candidate_id: true },
      });

    const total_votes = vote_counts.reduce(
      (sum, item) => sum + item._count.candidate_id,
      0,
    );

    const updated_session =
      await this.prisma.votingSession.update({
        where: { id: session_id },
        data: {
          is_published: true,
          published_at: new Date(),
        },
      });

    const total_candidates =
      await this.prisma.candidate.count();

    await this.prisma.auditLog.create({
      data: {
        user_id,
        action: "PUBLISH_RESULTS",
        target_id: session_id,
        old_value: JSON.stringify({
          is_published: false,
          published_at: null,
        }),
        new_value: JSON.stringify({
          is_published: true,
          published_at: updated_session.published_at,
        }),
        ip_address: "127.0.0.1",
        user_agent: "Server",
        created_at: new Date(),
      },
    });

    return {
      session_id,
      is_published: true,
      published_at: updated_session.published_at,
      total_votes,
      total_candidates,
    };
  };

  public get_session_results = async (
    session_id: string,
    is_published: boolean,
  ) => {
    const existing_session =
      await this.prisma.votingSession.findUnique({
        where: { id: session_id },
      });

    if (!existing_session)
      throw new NotFoundError("Voting session not found");

    if (!existing_session.is_published && !is_published)
      throw new ValidationError(
        "Results not published yet",
      );

    const vote_counts =
      await this.prisma.voteRecord.groupBy({
        by: ["candidate_id"],
        where: { session_id },
        _count: { candidate_id: true },
      });

    const candidate_ids = vote_counts.map(
      (vc) => vc.candidate_id,
    );
    const candidates = await this.prisma.candidate.findMany(
      {
        where: { id: { in: candidate_ids } },
        select: { id: true, name: true },
      },
    );

    const total_votes = vote_counts.reduce(
      (sum, item) => sum + item._count.candidate_id,
      0,
    );

    const results = vote_counts.map((vc) => {
      const candidate = candidates.find(
        (c) => c.id === vc.candidate_id,
      );
      const vote_count = vc._count.candidate_id;
      const percentage =
        total_votes > 0
          ? (vote_count / total_votes) * 100
          : 0;

      return {
        candidate_id: vc.candidate_id,
        candidate_name: candidate?.name || "Unknown",
        vote_count,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    return {
      session_id,
      is_published: existing_session.is_published,
      total_votes,
      results,
      published_at: existing_session.published_at,
    };
  };
}
