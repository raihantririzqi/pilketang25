import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { OAuth2Client } from "google-auth-library";
import { AuthController } from "./modules/auth/auth_controller";
import { AuthService } from "./modules/auth/auth_service";

// Environment variables
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SCANNER_URL = process.env.SCANNER_URL || "http://localhost:3002";

// Database setup
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root123",
  database: "pilketang25",
});

const prisma = new PrismaClient({ adapter });

// Google OAuth setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Services & Controllers
const authService = new AuthService(prisma, oauth2Client);
const authController = new AuthController(authService);

const app = new Elysia()
  .use(
    cors({
      origin: [FRONTEND_URL, SCANNER_URL],
      credentials: true,
    })
  )
  .use(openapi())
  .get("/", () => ({
    message: "Pilketang 2025 Backend API",
    version: "1.0",
    status: "healthy",
  }))
  .use(authController.register())
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
