import { PrismaClient } from "../../generated/prisma/client";
import { v4 as uuidv4 } from "uuid";
import { QRValidationResult, SubmitVoteResult } from "./voting_type";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/utils/error_util";

/**
 * Service responsible for managing the voting lifecycle, including
 * QR code generation, token validation, and anonymous vote submission.
 */
export class VotingService {
  public constructor(private readonly prisma: PrismaClient) { }

  /**
   * Validates a scanned QR code token and initiates a temporary voting session.
   *
   * @param qr_token - The token retrieved from the scanned QR code.
   * @returns A Result containing the temporary voting token and candidate list.
   *
   * @remarks
   * - Creates a short-lived (2-minute) temporary session for the voting booth.
   * - This ensures the actual voting process is decoupled from the user's primary identity.
   */
  public validate_qr = async (
    qr_token: string,
  ): Promise<QRValidationResult> => {
    const existing_qr_code = await this.prisma.qRCode.findUnique({
      where: { token: qr_token },
      include: { session: true },
    });

    if (!existing_qr_code)
      throw new NotFoundError("QR Code not found in our records");

    if (existing_qr_code.is_used)
      throw new ConflictError(
        "This QR Code has already been used to vote",
      );

    if (existing_qr_code.expires_at < new Date())
      throw new ValidationError(
        "The QR Code has expired. Please generate a new one",
      );

    if (!existing_qr_code.session.is_active)
      throw new ValidationError(
        "The voting session is currently closed or has ended",
      );

    // Atomically create the attendance record and the temporary session
    const new_temporary_voting_session = await this.prisma.$transaction(
      async (tx) => {
        // Ensure an attendance record exists, marking the user as "present"
        await tx.attendanceRecord.upsert({
          where: {
            user_id_session_id: {
              user_id: existing_qr_code.user_id,
              session_id: existing_qr_code.session_id,
            },
          },
          update: {}, // Nothing to update if it exists
          create: {
            user_id: existing_qr_code.user_id,
            session_id: existing_qr_code.session_id,
            has_voted: false,
          },
        });

        const temp_expires_at = new Date();
        temp_expires_at.setMinutes(temp_expires_at.getMinutes() + 2);

        const temp_session = await tx.temporaryVotingSession.create({
          data: {
            voting_token: uuidv4(),
            qr_token,
            session_id: existing_qr_code.session_id,
            expires_at: temp_expires_at,
          },
        });

        return temp_session;
      },
    );

    const candidates = await this.prisma.candidate.findMany({
      select: { id: true, name: true, vision: true, mission: true },
    });

    return {
      voting_token: new_temporary_voting_session.voting_token,
      session_id: new_temporary_voting_session.session_id,
      candidates,
      expires_in:
        new_temporary_voting_session.expires_at.getSeconds(),
    };
  };

  /**
   * Submits a vote for a specific candidate using a temporary voting token.
   * @param voting_token - The temporary token generated during QR validation.
   * @param candidate_id - The ID of the selected candidate.
   *
   * @returns A Result containing the recorded vote if successful.
   * @throws Error within transaction if the session is invalid or expired.
   *
   * @remarks
   * - Executed within a database transaction to ensure atomicity.
   * - Marks the QR code, temporary session, and attendance record as used/completed.
   * - Maintains anonymity by separating the vote record from the user ID.
   */
  submit_vote = async (
    voting_token: string,
    candidate_id: string,
  ): Promise<SubmitVoteResult> =>
    await this.prisma
      .$transaction(async (tx) => {
        const existing_temporary_session =
          await tx.temporaryVotingSession.findUnique({
            where: { voting_token },
            include: { qr_code: true },
          });

        if (!existing_temporary_session)
          throw new NotFoundError("Voting session token not found");

        if (existing_temporary_session.is_used)
          throw new ConflictError(
            "This voting token has already been used",
          );

        if (existing_temporary_session.expires_at < new Date())
          throw new ValidationError(
            "Voting session has expired. Please re-scan your QR",
          );

        const new_vote_record = await tx.voteRecord.create({
          data: {
            id: uuidv4(),
            session_id: existing_temporary_session.session_id,
            candidate_id: candidate_id,
            qr_token: existing_temporary_session.qr_token,
            voting_token: voting_token,
          },
        });

        await tx.temporaryVotingSession.update({
          where: { voting_token },
          data: { is_used: true },
        });

        await tx.qRCode.update({
          where: { token: existing_temporary_session.qr_token },
          data: { is_used: true },
        });

        await tx.attendanceRecord.update({
          where: {
            user_id_session_id: {
              user_id: existing_temporary_session.qr_code.user_id,
              session_id: existing_temporary_session.session_id,
            },
          },
          data: { has_voted: true },
        });

        return new_vote_record;
      })
      .then((result) => ({
        receipt_id: result.id,
        session_id: result.session_id,
        candidate_id: result.candidate_id,
      }));
}
