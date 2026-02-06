import { PrismaClient } from "../../generated/prisma/client";
import { NotFoundError } from "../../shared/utils/error_util";
import {
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "./candidate_type";

export class CandidateService {
  public constructor(private readonly prisma: PrismaClient) {}

  public get_all_candidates = async () =>
    await this.prisma.candidate.findMany({
      select: {
        id: true,
        name: true,
        nim: true,
        vision: true,
        mission: true,
        photo_url: true,
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

  public create_candidate = async (data: CreateCandidateRequest) =>
    await this.prisma.candidate.create({ data });

  public update_candidate = async (
    id: string,
    data: UpdateCandidateRequest,
  ) => {
    const existing_candidate = await this.prisma.candidate.findUnique(
      { where: { id } },
    );

    if (!existing_candidate)
      throw new NotFoundError("Candidate not found");

    return await this.prisma.candidate.update({
      where: { id },
      data,
    });
  };

  public delete_candidate = async (id: string) => {
    const existing_candidate = await this.prisma.candidate.findUnique(
      { where: { id } },
    );

    if (!existing_candidate)
      throw new NotFoundError("Candidate not found");

    return await this.prisma.candidate.delete({ where: { id } });
  };
}
