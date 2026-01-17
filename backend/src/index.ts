import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { routes } from "./routes";
import { errorMiddleware } from "./shared/middlewares/error_middleware";

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
