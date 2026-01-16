import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const setup_jwt = (app: Elysia) =>
  app.use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "Miss Pink Elf♪",
      exp: process.env.JWT_EXPIRES_IN || "30m",
      alg: "HS512",
    }),
  );
