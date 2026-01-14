import openapi from "@elysiajs/openapi";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
});

const prisma = new PrismaClient({ adapter });

const app = new Elysia()
  .use(openapi())
  .get("/", () => ({
    message: "Pilketang 2025 Backend API",
    version: "1.0",
    status: "healthy",
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
