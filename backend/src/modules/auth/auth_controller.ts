import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { AuthService } from "./auth_service";
import { SuccessResponse } from "../../shared/types/custom_types";
import { AuthenticationError } from "../../shared/utils/error_util";
import {
  GoogleCallbackResult,
  UserProfile,
} from "./auth_type";

/**
 * Controller providing HTTP endpoints for the Authentication module.
 *
 * Uses ElysiaJS and `@elysiajs/jwt` for token management and validation.
 */
export class AuthController {
  public constructor(
    private readonly service: AuthService,
    private readonly prefix = "/auth",
  ) {}

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
        }): Promise<
          SuccessResponse<GoogleCallbackResult>
        > => {
          const { code, redirect_uri } = body;
          const result = await this.service.google_callback(
            code,
            redirect_uri,
            async (p) => await access_jwt.sign(p),
            async (p) => await refresh_jwt.sign(p),
          );

          refresh_token_cookie.set({
            value: result.refresh_token,
            httpOnly: true,
            maxAge: 7 * 86400,
            path: "/",
            secure: process.env.BUN_ENV === "production",
            sameSite: "lax",
          });

          return {
            code: 200,
            message:
              "Authentication with Google has been successful",
            result: result,
          };
        },
        {
          body: t.Object({
            code: t.String(),
            redirect_uri: t.String(),
          }),
          detail: {
            tags: ["Auth"],
            description: "Google OAuth callback endpoint",
            responses: {
              200: {
                description: "Authentication successful",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "Authentication succesful",
                        },
                        result: {
                          type: "object",
                          properties: {
                            access_token: {
                              type: "string",
                              example:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            },
                            refresh_token: {
                              type: "string",
                              example:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            },
                            user: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                  example:
                                    "user_123e4567-e89b-12d3-a456-426614174000",
                                },
                                google_id: {
                                  type: "string",
                                  example:
                                    "112345678901234567890",
                                },
                                name: {
                                  type: "string",
                                  example: "John Doe",
                                },
                                email: {
                                  type: "string",
                                  example:
                                    "john.doe@student.itera.ac.id",
                                },
                                nim: {
                                  type: "string",
                                  example: "125140123",
                                },
                                profile_picture: {
                                  type: "string",
                                  nullable: true,
                                  example:
                                    "https://lh3.googleusercontent.com/a-/AOh14Gh...",
                                },
                                role: {
                                  type: "string",
                                  example: "PARTICIPANT",
                                },
                                created_at: {
                                  type: "string",
                                  format: "date-time",
                                  example:
                                    "2026-01-15T08:30:45.000Z",
                                },
                                updated_at: {
                                  type: "string",
                                  format: "date-time",
                                  example:
                                    "2026-01-16T10:15:22.000Z",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description:
                  "Bad Request - Missing required fields",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 400,
                        },
                        message: {
                          type: "string",
                          example:
                            "Missing required fields",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "code is required",
                            "redirect_uri is required",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Authentication failed",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 401,
                        },
                        message: {
                          type: "string",
                          example: "Authentication failed",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "Invalid authorization code",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description:
                  "Forbidden - Email not in whitelist",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 403,
                        },
                        message: {
                          type: "string",
                          example: "Forbidden",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "Only campus email addresses are allowed",
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
        }): Promise<
          SuccessResponse<{ access_token: string }>
        > => {
          const token = refresh_token_cookie.value;
          if (!token)
            throw new AuthenticationError(
              "No refresh token provided",
            );

          const payload = await refresh_jwt.verify(
            token as string,
          );
          if (!payload)
            throw new AuthenticationError(
              "Invalid or expired refresh token",
            );

          const result = await this.service.refresh(
            payload as any,
          );
          const new_access_token = await access_jwt.sign(
            result.access_token_payload,
          );

          return {
            code: 200,
            message: "Token refreshed",
            result: {
              access_token: new_access_token,
            },
          };
        },
        {
          detail: {
            tags: ["Auth"],
            description:
              "Refresh access token using refresh token cookie",
            responses: {
              200: {
                description: "Token refreshed successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "Token refreshed successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            access_token: {
                              type: "string",
                              example:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description:
                  "Unauthorized - No refresh token or invalid token",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 401,
                        },
                        message: {
                          type: "string",
                          example: "Authentication failed",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "No refresh token provided",
                            "Invalid or expired refresh token",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description:
                  "Forbidden - Refresh token revoked",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 403,
                        },
                        message: {
                          type: "string",
                          example: "Access denied",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "Refresh token has been revoked",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 500,
                        },
                        message: {
                          type: "string",
                          example: "Internal server error",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "Failed to refresh token",
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
        }): Promise<
          SuccessResponse<{ success: boolean }>
        > => {
          const auth_header = headers[
            "Authorization"
          ]?.replace("Bearer ", "");
          const refresh_token =
            refresh_token_cookie.value as
              | string
              | undefined;

          const revoke = async (
            token: string | undefined,
            jwt_instance: any,
          ) => {
            if (!token) return;
            const payload =
              await jwt_instance.verify(token);
            if (payload)
              await this.service.logout(payload as any);
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
        {
          detail: {
            tags: ["Auth"],
            description:
              "Logout user and revoke all active tokens",
            security: [{ bearerAuth: [] }],
            responses: {
              200: {
                description: "Logout successful",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "Successfully logged out",
                        },
                        result: {
                          type: "object",
                          properties: {
                            success: {
                              type: "boolean",
                              example: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description:
                  "Unauthorized - Invalid or missing token",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 401,
                        },
                        message: {
                          type: "string",
                          example: "Authentication failed",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: ["Invalid access token"],
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Internal Server Error",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 500,
                        },
                        message: {
                          type: "string",
                          example: "Internal server error",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "Failed to revoke tokens",
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
          const auth_header = headers[
            "authorization"
          ]?.replace("Bearer ", "");

          if (!auth_header)
            throw new AuthenticationError(
              "No token provided",
            );

          const payload =
            await access_jwt.verify(auth_header);
          if (!payload)
            throw new AuthenticationError(
              "Invalid or expired token",
            );

          const user = await this.service.getMe(
            payload.sub as string,
          );

          return {
            code: 200,
            message: "User profile retrieved",
            result: user,
          };
        },
        {
          detail: {
            tags: ["Auth", "Profile"],
            description:
              "Get current authenticated user profile",
            security: [{ bearerAuth: [] }],
            responses: {
              200: {
                description:
                  "User profile retrieved successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "User profile retrieved successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              example:
                                "user_123e4567-e89b-12d3-a456-426614174000",
                            },
                            google_id: {
                              type: "string",
                              example:
                                "112345678901234567890",
                            },
                            name: {
                              type: "string",
                              example: "John Doe",
                            },
                            email: {
                              type: "string",
                              example:
                                "john.doe@student.itera.ac.id",
                            },
                            nim: {
                              type: "string",
                              example: "125140123",
                            },
                            profile_picture: {
                              type: "string",
                              nullable: true,
                              example:
                                "https://lh3.googleusercontent.com/a-/AOh14Gh...",
                            },
                            role: {
                              type: "string",
                              enum: [
                                "ADMIN",
                                "COMMITTEE",
                                "PARTICIPANT",
                              ],
                              example: "PARTICIPANT",
                            },
                            created_at: {
                              type: "string",
                              format: "date-time",
                              example:
                                "2026-01-15T08:30:45.000Z",
                            },
                            updated_at: {
                              type: "string",
                              format: "date-time",
                              example:
                                "2026-01-16T10:15:22.000Z",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description:
                  "Unauthorized - Invalid or missing token",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 401,
                        },
                        message: {
                          type: "string",
                          example: "Authentication failed",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: [
                            "No token provided",
                            "Invalid or expired token",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              404: {
                description: "Not Found - User not found",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 404,
                        },
                        message: {
                          type: "string",
                          example: "Resource not found",
                        },
                        errors: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          example: ["User not found"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      );
}
