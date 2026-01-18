import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { routes } from "./routes";
import { errorMiddleware } from "./shared/middlewares/error_middleware";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

// 1. Inisialisasi Adapter & Prisma
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

// --- CONFIG CORS ---
// Ambil URL dari env dan masukkan ke dalam array
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.SCANNER_URL
].filter(Boolean) as string[]; // filter(Boolean) untuk membuang nilai kosong jika env lupa diisi

const app = new Elysia()
  .use(
    cors({
      // Mengizinkan origin dari array yang kita buat
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,

      // Wajib 'true' jika frontend mengirimkan cookie atau header Authorization
      credentials: true,

      // Header yang diizinkan
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],

      // Method yang diizinkan
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  .use(openapi())
  .use(errorMiddleware)
  .get("/", () => ({ status: "healthy" }))
  .use(routes)
  .listen(process.env.PORT || 3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`🌐 Allowed Origins: ${allowedOrigins.join(", ")}`);