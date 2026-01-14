import { Candidate } from "../../generated/prisma/client";

export type CreateCandidate = Omit<
  Candidate,
  "id" | "created_at" | "updated_at"
>;

export type UpdateCandidate = Omit<
  Candidate,
  "created_at" | "updated_at"
>;
