import { t } from "elysia";
import { Candidate } from "../../generated/prisma/client";

export type GetAllCandidatesResponse = Omit<
  Candidate,
  "created_at" | "updated_at"
>[];

export type CreateCandidateRequest = Omit<
  Candidate,
  "id" | "created_at" | "updated_at"
>;

export type UpdateCandidateRequest = Partial<
  Omit<Candidate, "id" | "created_at" | "updated_at">
>;

export const create_candidate_schema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String(),
  nim: t.String(),
  vision: t.String(),
  mission: t.String(),
});

export const update_candidate_schema = t.Partial(
  t.Omit(create_candidate_schema, ["id"]),
);
