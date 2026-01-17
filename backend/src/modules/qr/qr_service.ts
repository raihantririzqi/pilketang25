import { PrismaClient } from "../../generated/prisma/client";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../shared/utils/error_util";
import { GenerateQRResult, SimpleQRResult } from "./qr_type";
import { v4 as uuidv4 } from "uuid";

export class QRService {
  public constructor(private readonly prisma: PrismaClient) { }
  /**
   * Generates a simple QR token for a user by auto-detecting active session.
   * This is a simplified version for the kiosk voting flow.
   *
   * @param user_id - The unique identifier of the user.
   * @returns SimpleQRResult containing token and user info.
   */
  public generate_simple_qr = async (
    user_id: string,
  ): Promise<SimpleQRResult> => {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) throw new NotFoundError("User not found");

    // Find active voting session
    const activeSession = await this.prisma.votingSession.findFirst({
      where: { is_active: true },
    });

    if (!activeSession) {
      throw new ValidationError("No active voting session available");
    }

    // Check if user already has an active (unused, not expired) QR code
    const existingQR = await this.prisma.qRCode.findFirst({
      where: {
        user_id,
        session_id: activeSession.id,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (existingQR) {
      return {
        token: existingQR.token,
        user_name: user.name,
        user_nim: user.nim,
        expires_at: existingQR.expires_at,
      };
    }

    // Check if user has already voted in this session
    const attendanceRecord = await this.prisma.attendanceRecord.findUnique({
      where: {
        user_id_session_id: {
          user_id,
          session_id: activeSession.id,
        },
      },
    });


    if (attendanceRecord?.has_voted) {
      throw new ConflictError("You have already voted in this session");
    }

    // Delete any existing expired/unused QR codes for this user and session
    await this.prisma.qRCode.deleteMany({
      where: {
        user_id,
        session_id: activeSession.id,
        is_used: false,
      },
    });

    // Create new QR code (expires in 30 seconds)
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + 30);

    const new_qr = await this.prisma.qRCode.create({
      data: {
        token: uuidv4(),
        voting_token: uuidv4(),
        user_id,
        session_id: activeSession.id,
        expires_at,
      },
    });

    return {
      token: new_qr.token,
      user_name: user.name,
      user_nim: user.nim,
      profile_picture: user.profile_picture || undefined,
      expires_at: new_qr.expires_at,
    };
  };

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

  public get_qr_status = async (token: string): Promise<{ is_used: boolean }> => {
    const qr_code = await this.prisma.qRCode.findUnique({
      where: {
        token: token,
      },
    });

    if (!qr_code) {
      throw new NotFoundError("QR code not found");
    }

    return { is_used: qr_code.is_used };
  };
}
