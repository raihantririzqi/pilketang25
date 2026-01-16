import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
<<<<<<< HEAD
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { OAuth2Client } from "google-auth-library";
import { AuthController } from "./modules/auth/auth_controller";
import { AuthService } from "./modules/auth/auth_service";
import { QRController } from "./modules/qr/qr_controller";
import { QRService } from "./modules/qr/qr_service";
import { VotingController } from "./modules/voting/voting_controller";
import { VotingService } from "./modules/voting/voting_service";
import { errorMiddleware } from "./shared/middlewares/error_middleware";
=======
import { routes } from "./routes";
>>>>>>> df7c941 (feat(voting): add scanner controller)

// Environment variables
const PORT = process.env.PORT || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";
const SCANNER_URL =
  process.env.SCANNER_URL || "http://localhost:3002";

const app = new Elysia()
  .use(
    cors({
      origin: [FRONTEND_URL, SCANNER_URL],
      credentials: true,
    }),
  )
  .use(openapi())
  .use(errorMiddleware)
  .get("/", () => ({
    message: "Pilketang 2025 Backend API",
    version: "1.0",
    status: "healthy",
  }))
  .use(routes)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
