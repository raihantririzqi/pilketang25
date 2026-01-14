import { Candidate } from "../../generated/prisma/client";

export type QRValidationResult = {
  voting_token: string;
  session_id: string;
  candidates: Pick<Candidate, "id" | "name" | "vision" | "mission">[];
  expires_in: number;
};

export type SubmitVoteResult = {
  receipt_id: string;
  session_id: string;
  candidate_id: string;
  voted_at: Date;
};
