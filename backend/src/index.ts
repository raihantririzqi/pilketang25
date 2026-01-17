import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { routes } from "./routes";
import { errorMiddleware } from "./shared/middlewares/error_middleware";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

// 1. Inisialisasi Adapter (Wajib untuk Prisma dengan MariaDB/MySQL Driver)
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

// --- BAGIAN DEBUG ---
async function debugConnection() {
  console.log("-----------------------------------------");
  console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "DITEMUKAN" : "KOSONG");
  try {
    await prisma.$connect();
    console.log("✅ Database Berhasil Terhubung!");
  } catch (err) {
    console.error("❌ Database Gagal Terhubung:", err);
  }
}
debugConnection();
// --- END DEBUG ---

const PORT = process.env.PORT || 3001;

const app = new Elysia()
  .use(cors())
  .use(openapi())
  .use(errorMiddleware)
  .get("/", () => ({ status: "healthy" }))
  .use(routes)
  .listen(PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);