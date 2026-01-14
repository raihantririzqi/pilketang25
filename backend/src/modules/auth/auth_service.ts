import { err, ok, Result } from "neverthrow";
import { PrismaClient } from "../../generated/prisma/client";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import {
  GenerateTokenPayloadResult,
  GoogleCallbackResult,
  RefreshResult,
  ValidateGooglePayloadResult,
} from "./auth_type";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "../../shared/utils/error_util";

/**
 * Service handling core authentication logic, including Google OAuth2 callback,
 * token generation, token refreshing, and session revocation (logout).
 */
export class AuthService {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly oauth2: OAuth2Client,
  ) { }

  /**
   * Processes the Google OAuth2 callback by exchanging the authorization code for user data
   * and generating a pair of signed JWT tokens.
   *
   * @param code - The authorization code received from the Google frontend popup/redirect.
   * @param redirect_uri - The URI registered in Google Console to prevent redirect mismatch.
   * @param sign_access_token - Callback function to sign the Access Token payload.
   * @param sign_refresh_token - Callback function to sign the Refresh Token payload.
   * @returns A `GoogleCallbackResult` containing the user data and signed JWTs.
   */
  public google_callback = async (
    code: string,
    redirect_uri: string,
    sign_access_token: (payload: any) => Promise<string>,
    sign_refresh_token: (payload: any) => Promise<string>,
  ): Promise<GoogleCallbackResult> => {
    if (code.trim() === "" || redirect_uri.trim() === "")
      throw new ValidationError(
        "Authorization code and redirect_uri are required",
      );

    const { tokens } = await this.oauth2
      .getToken({
        code,
        redirect_uri,
      })
      .catch(() => {
        throw new AuthenticationError(
          "Failed to exchange Google code",
        );
      });

    if (!tokens.id_token)
      throw new AuthenticationError("Invalid ID token from Google");

    const ticket = await this.oauth2.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 1. Ambil payload mentah dari ticket
    const payload = ticket.getPayload();

    // 2. Pastikan fungsi validate_google_payload kamu juga menangkap field 'picture'
    const validate = this.validate_google_payload(payload);
    if (validate.isErr()) throw new ValidationError(validate.error);

    const valid_data = validate.value;
    // Ambil URL foto dari payload (biasanya ada di payload.picture)
    const profile_picture = payload?.picture;

    const user = await this.prisma.user.upsert({
      where: { google_id: valid_data.google_id },
      update: {
        name: valid_data.name,
        image: profile_picture, // Update foto profil jika berubah
        updated_at: new Date(),
      },
      create: {
        id: `user_${uuidv4()}`,
        google_id: valid_data.google_id,
        name: valid_data.name,
        email: valid_data.email,
        image: profile_picture, // Simpan foto saat pertama kali daftar
        nim: valid_data.nim,
        role: "PARTICIPANT",
      },
    });

    const token_payloads = await this.generate_token_payload(
      user.id,
      user.role,
    );

    return {
      user,
      signed_access_token: await sign_access_token(
        token_payloads.access_token_payload,
      ),
      signed_refresh_token: await sign_refresh_token(
        token_payloads.refresh_token_payload,
      ),
    };
  };

  /**
   * Generates a new Access Token payload using a valid Refresh Token.
   *
   * Checks the database to ensure the Refresh Token has not been blacklisted.
   *
   * @param payload - The decoded payload from the existing Refresh Token.
   * @returns An object containing the new Access Token payload and expiry metadata.
   */
  public refresh = async (payload: {
    jti: string;
    sub: string;
  }): Promise<RefreshResult> => {
    const is_blacklisted =
      await this.prisma.tokenBlacklist.findUnique({
        where: { jti: payload.jti },
      });

    if (is_blacklisted)
      throw new AuthenticationError("Refresh token has been revoked");

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new NotFoundError("User not found");

    const tokens = await this.generate_token_payload(
      user.id,
      user.role,
    );
    return {
      access_token_payload: tokens.access_token_payload,
      token_type: "Bearer",
      expires_in: 1800,
    };
  };

  /**
   * Revokes a specific JWT by adding its unique identifier (JTI) to the blacklist.
   *
   * @param payload - The decoded JWT payload containing JTI, User ID, and Expiration.
   * @returns A success or error Result.
   */
  public logout = async (payload: {
    jti: string;
    sub: string;
    exp: number;
  }): Promise<Result<string, string>> => {
    try {
      await this.prisma.tokenBlacklist.create({
        data: {
          jti: payload.jti,
          user_id: payload.sub,
          expires_at: new Date(payload.exp * 1000),
        },
      });

      return ok("Logout successful");
    } catch (error) {
      return err("Logout process failed");
    }
  };

  /**
   * Internal validation for Google identity payloads.
   *
   * Restricts access to `student.itera.ac.id` domains and specific NIM patterns (Informatics Students Batch 2025).
   */
  private validate_google_payload(
    payload: any,
  ): Result<ValidateGooglePayloadResult, string> {
    if (!payload || !payload.email || !payload.name)
      throw new ValidationError("Google profile data is incomplete");

    if (!payload.email.endsWith("@student.itera.ac.id"))
      throw new ValidationError(
        "Must use student.itera.ac.id domain",
      );

    const email_parts = payload.email.split("@")[0].split(".");
    const raw_nim = email_parts[email_parts.length - 1];

    if (!/^125140\d{3}$/.test(raw_nim))
      throw new ValidationError(
        "Only Informatics Students batch 2025 are allowed",
      );

    return ok({
      google_id: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name,
      nim: raw_nim,
    });
  }

  /**
   * Internal helper to create unique payloads for both Access and Refresh tokens.
   */
  private generate_token_payload = async (
    user_id: string,
    role: string,
  ): Promise<GenerateTokenPayloadResult> => ({
    access_token_payload: {
      sub: user_id,
      role: role,
      jti: uuidv4(),
    },
    refresh_token_payload: {
      sub: user_id,
      role: role,
      jti: uuidv4(),
    },
  });
}
