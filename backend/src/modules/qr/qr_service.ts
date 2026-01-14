import { PrismaClient } from "../../generated/prisma/client";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/utils/error_util";
import { GenerateQRResult } from "./qr_type";
import { v4 as uuidv4 } from "uuid";

export class QRService {
  public constructor(private readonly prisma: PrismaClient) {}

  /**
   * Generates a unique QR code for a user to participate in a specific voting session.
   *
   * @param user_id - The unique identifier of the user.
   * @param session_id - The ID of the active voting session.
   * @returns A Result containing the QRCode object if successful, or an error message.
   *
   * @remarks
   * - Validates if the session is active.
   * - Verifies user attendance and ensures the user hasn't voted yet.
   * - Reuses existing valid QR codes if they haven't expired (5-minute TTL).
   */
  public generate_qr = async (
    user_id: string,
    session_id: string,
  ): Promise<GenerateQRResult> => {
    const voting_session = await this.prisma.votingSession.findUnique(
      {
        where: { id: session_id },
      },
    );

    if (!voting_session || !voting_session.is_active)
      throw new ValidationError(
        "The voting session is inactive or not found",
      );

    const attendance_record =
      await this.prisma.attendanceRecord.findFirst({
        where: { user_id, session_id },
      });

    if (!attendance_record)
      throw new NotFoundError(
        "You are not registered for this session's attendance",
      );

    if (attendance_record.has_voted)
      throw new ConflictError(
        "You have already exercised your right to vote",
      );

    const existing_qr_code = await this.prisma.qRCode.findFirst({
      where: {
        user_id,
        session_id,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (existing_qr_code)
      return {
        qr_code_url: existing_qr_code.token,
        session_id,
        created_at: existing_qr_code.created_at,
        expires_at: existing_qr_code.expires_at.getSeconds(),
      };

    const expires_at = new Date();
    expires_at.setMinutes(expires_at.getMinutes() + 5);

    const new_qr_code = await this.prisma.qRCode.create({
      data: {
        token: uuidv4(),
        voting_token: uuidv4(),
        user_id,
        session_id,
        expires_at,
      },
    });

    return {
      qr_code_url: new_qr_code.token,
      session_id,
      created_at: new_qr_code.created_at,
      expires_at: new_qr_code.expires_at.getSeconds(),
    };
  };
}
