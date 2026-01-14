import { PrismaClient } from "../../generated/prisma/client";
import { NotFoundError } from "../../shared/utils/error_util";
import { CreateCandidate, UpdateCandidate } from "./candidate_type";

export class CandidateService {
  public constructor(private readonly prisma: PrismaClient) {}

  public get_all_candidates = async () =>
    await this.prisma.candidate.findMany({
      select: {
        name: true,
        nim: true,
        vision: true,
        mission: true,
      },
    });

  public get_candidate_by_id = async (id: string) => {
    const existing_candidate = await this.prisma.candidate.findUnique(
      {
        where: { id },
        select: {
          name: true,
          nim: true,
          vision: true,
          mission: true,
        },
      },
    );

    if (!existing_candidate)
      throw new NotFoundError("Candidate not found");

    return existing_candidate;
  };

  public create_candidate = async (data: CreateCandidate) =>
    await this.prisma.candidate.create({ data });

  public update_candidate = async (data: UpdateCandidate) => {
    const existing_candidate = await this.prisma.candidate.findUnique(
      { where: { id: data.id } },
    );

    if (!existing_candidate)
      throw new NotFoundError("Candidate not found");

    const updated_candidate = await this.prisma.candidate.update({
      where: { id: data.id },
      data,
    });

    return updated_candidate;
  };
}
