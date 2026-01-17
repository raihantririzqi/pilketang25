import Elysia from "elysia";
import { AuthService } from "./modules/auth/auth_service";
import { AuthController } from "./modules/auth/auth_controller";
import { QRService } from "./modules/qr/qr_service";
import { QRController } from "./modules/qr/qr_controller";
import { VotingService } from "./modules/voting/voting_service";
import { VotingController } from "./modules/voting/voting_controller";
import { PrismaClient } from "./generated/prisma/client";
import { OAuth2Client } from "google-auth-library";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Database setup
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "pilketang25",
  connectionLimit: 50,
  acquireTimeout: 30000,
});

const prisma = new PrismaClient({ adapter });

// Google OAuth setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

// Services & Controllers
const auth_service = new AuthService(prisma, oauth2Client);
const auth_controller = new AuthController(auth_service);

const qr_service = new QRService(prisma);
const qr_controller = new QRController(prisma, qr_service);

const voting_service = new VotingService(prisma);
const voting_controller = new VotingController(
  prisma,
  voting_service,
);

export const routes = new Elysia({ prefix: "/api" })
  .use(auth_controller.register())
  .use(qr_controller.register())
  .use(voting_controller.register());
