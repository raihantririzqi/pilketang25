import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { AuthService } from "./auth_service";
import { SuccessResponse } from "../../shared/types/custom_types";
import { AuthenticationError } from "../../shared/utils/error_util";
import { GoogleCallbackResult, UserProfile } from "./auth_type";

/**
 * Controller providing HTTP endpoints for the Authentication module.
 *
 * Uses ElysiaJS and `@elysiajs/jwt` for token management and validation.
 */
export class AuthController {
  public constructor(
    private readonly service: AuthService,
    private readonly prefix = "/auth",
  ) { }

  /**
   * Registers authentication routes:
   *
   * - POST `/auth/google/callback`
   *
   * Exchanges Google code for session tokens.
   *
   * - POST `/auth/refresh`
   *
   * Generates new Access Token via Refresh Cookie.
   *
   * - POST `/auth/logout`
   *
   * Revokes current session and clears cookies.
   *
   */
  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(
        jwt({
          name: "access_jwt",
          secret: process.env.JWT_SECRET!,
          exp: '1m',
        }),
      )
      .use(
        jwt({
          name: "refresh_jwt",
          secret: process.env.REFRESH_TOKEN_SECRET!,
        }),
      )
      /**
       * @endpoint POST /auth/google
       * @desc Authenticates user via Google and sets an HttpOnly Refresh Token cookie.
       */
      .post(
        "/google/callback",
        async ({
          body,
          cookie: { refresh_token_cookie },
          access_jwt,
          refresh_jwt,
        }): Promise<SuccessResponse<GoogleCallbackResult>> => {
          const { code, redirect_uri } = body;
          const result = await this.service.google_callback(
            code,
            redirect_uri,
            async (p) => await access_jwt.sign(p),
            async (p) => await refresh_jwt.sign(p),
          );

          refresh_token_cookie.set({
            value: result.signed_refresh_token,
            httpOnly: true,
            maxAge: 7 * 86400,
            path: "/",
            secure: process.env.BUN_ENV === "production",
            sameSite: "lax",
          });

          return {
            code: 200,
            message: "Authentication with Google has been successful",
            result: result,
          };
        },
        {
          body: t.Object({
            code: t.String(),
            redirect_uri: t.String(),
          }),
        },
      )
      /**
       * @endpoint POST /auth/refresh
       * @desc Issues a new Access Token if the Refresh Token cookie is valid and not blacklisted.
       */
      .post(
        "/refresh",
        async ({
          cookie: { refresh_token_cookie },
          refresh_jwt,
          access_jwt,
        }): Promise<SuccessResponse<{ signed_access_token: string }>> => {
          const token = refresh_token_cookie.value;
          if (!token)
            throw new AuthenticationError(
              "No refresh token provided",
            );

          const payload = await refresh_jwt.verify(token as string);
          if (!payload)
            throw new AuthenticationError(
              "Invalid or expired refresh token",
            );

          const result = await this.service.refresh(payload as any);
          const new_access_token = await access_jwt.sign(
            result.access_token_payload,
          );

          return {
            code: 200,
            message: "Token refreshed",
            result: { signed_access_token: new_access_token },
          };
        },
      )
      /**
       * @endpoint POST /auth/logout
       * @desc Blacklists both Access and Refresh tokens to fully terminate the session.
       */
      .post(
        "/logout",
        async ({
          headers,
          access_jwt,
          refresh_jwt,
          cookie: { refresh_token_cookie },
        }): Promise<SuccessResponse<{ success: boolean }>> => {
          const auth_header = headers["Authorization"]?.replace(
            "Bearer ",
            "",
          );
          const refresh_token = refresh_token_cookie.value as
            | string
            | undefined;

          const revoke = async (
            token: string | undefined,
            jwt_instance: any,
          ) => {
            if (!token) return;
            const payload = await jwt_instance.verify(token);
            if (payload) await this.service.logout(payload as any);
          };

          await Promise.all([
            revoke(auth_header, access_jwt),
            revoke(refresh_token, refresh_jwt),
          ]);

          refresh_token_cookie.remove();
          return {
            code: 200,
            message: "Successfully logged out",
            result: {
              success: true,
            },
          };
        },
      )
      /**
       * @endpoint GET /auth/me
       * @desc Returns the current authenticated user's profile.
       */
      .get(
        "/me",
        async ({
          headers,
          access_jwt,
        }): Promise<SuccessResponse<UserProfile>> => {
          const auth_header = headers["authorization"]?.replace(
            "Bearer ",
            "",
          );

          if (!auth_header)
            throw new AuthenticationError("No token provided");

          const payload = await access_jwt.verify(auth_header);
          if (!payload)
            throw new AuthenticationError("Invalid or expired token");

          const user = await this.service.getMe(payload.sub as string);

          return {
            code: 200,
            message: "User profile retrieved",
            result: user,
          };
        },
      );
}
