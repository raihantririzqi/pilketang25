import Elysia from "elysia";
import { AuthenticationError } from "../utils/error_util";
import cors from "@elysiajs/cors";

export class ScannerMiddleware {
  public static register = () =>
    new Elysia()
      .use(
        cors({
          origin: process.env.SCANNER_URL,
          methods: ["POST"],
          allowedHeaders: ["Content-Type", "X-Scanner-Secret"],
        }),
      )
      .derive(({ headers }) => {
        const scanner_secret_header = headers["X-Scanner-Secret"];
        if (
          !scanner_secret_header ||
          scanner_secret_header !== process.env.SCANNER_SECRET!
        )
          throw new AuthenticationError(
            "Invalid or missing Scanner Secret Header",
          );

        return { is_scanner: true };
      });
}
