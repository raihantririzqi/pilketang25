import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

export const setup_jwt = (app: Elysia) =>
  app.use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: process.env.JWT_EXPIRES_IN || "30m",
      alg: "HS512",
    }),
  );
