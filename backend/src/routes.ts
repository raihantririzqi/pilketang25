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

/**
 * 1. Database Setup (Singleton Pattern sangat disarankan dipindah ke file terpisah)
 * Konfigurasi ini sudah benar untuk VPS 2-core / 8 GB RAM kamu.
 */
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "pilketang25",
  connectionLimit: 50, // Melewati limit default 10 di VPS
  acquireTimeout: 30000,
});

const prisma = new PrismaClient({ adapter });

/**
 * 2. Google OAuth setup
 */
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

/**
 * 3. Services (Inject prisma ke masing-masing Service)
 */
const auth_service = new AuthService(prisma, oauth2Client);
const qr_service = new QRService(prisma);
const voting_service = new VotingService(prisma);

/**
 * 4. Controllers (Hanya inject Service yang dibutuhkan)
 * PERBAIKAN: Hapus parameter 'prisma' dari constructor Controller.
 */
const auth_controller = new AuthController(auth_service);
const qr_controller = new QRController(prisma, qr_service); // Benar: Hanya Service
const voting_controller = new VotingController(voting_service); // Benar: Hanya Service

/**
 * 5. Routes Definition
 */
export const routes = new Elysia({ prefix: "/api" })
  .use(auth_controller.register())
  .use(qr_controller.register())
  .use(voting_controller.register());