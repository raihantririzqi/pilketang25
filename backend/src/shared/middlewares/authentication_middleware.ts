import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { PrismaClient } from "../../generated/prisma/client";
import { user_role_schema } from "../types/custom_types";
import { AuthenticationError } from "../utils/error_util";

/**
 * Middleware for handling JWT authentication and authorization.
 * Provides identity derivation and token revocation checks.
 */
export class AuthenticationMiddleware {
  public constructor(private readonly prisma: PrismaClient) {}

  /**
   * Registers the JWT plugin and derives user identity from the `Authorization` header.
   *
   * @remarks
   * This middleware uses the `derive` lifecycle with `as: "global"` to ensure
   * authenticated user data is available to all subsequent handlers in the chain.
   *
   *  @returns An Elysia instance with the global authentication context.
   * @throws 401 Unauthorized if the token is missing, malformed, or blacklisted.
   */
  public register = () =>
    new Elysia()
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET!,
          schema: t.Object({
            sub: t.String(),
            role: user_role_schema,
            jti: t.String(),
          }),
        }),
      )
      .derive({ as: "global" }, async ({ jwt, headers, set }) => {
        const auth_header = headers["authorization"] || headers["Authorization"];
        if (!auth_header?.startsWith("Bearer ")) {
          set.status = 401;
          throw new Error("Missing authorization header");
        }

        const token = auth_header.split(" ")[1];
        const payload = await jwt.verify(token);

        if (!payload || !payload.sub || !payload.role || !payload.jti)
          throw new AuthenticationError("Invalid token payload");

        const is_blacklisted =
          await this.prisma.tokenBlacklist.findUnique({
            where: { jti: payload.jti },
          });

        if (is_blacklisted)
          throw new AuthenticationError("Token has been revoked");

        return {
          user: {
            id: payload.sub,
            role: payload.role,
            jti: payload.jti,
          },
        };
      });
}
