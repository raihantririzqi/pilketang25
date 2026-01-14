import { PrismaClient } from "../../generated/prisma/client";
import { NotFoundError } from "../../shared/utils/error_util";

export class AdminService {
  public constructor(private readonly prisma: PrismaClient) {}

  public get_live_stats = async (session_id: string) => {
    const session = await this.prisma.votingSession.findUnique({
      where: { id: session_id },
    });

    if (!session) throw new NotFoundError("Voting session not found");
    const total_votes_per_candidate =
      await this.prisma.voteRecord.groupBy({
        by: ["candidate_id"],
        _count: { id: true },
        where: { session_id },
      });

    const total_voters = await this.prisma.attendanceRecord.count({
      where: { session_id, has_voted: true },
    });

    return {
      candidates: total_votes_per_candidate,
      total_participation: total_voters,
    };
  };
}
