import Elysia, { t } from "elysia";
import { PrismaClient } from "../../generated/prisma/client";
import { QRService } from "./qr_service";
import { SuccessResponse } from "../../shared/types/custom_types";
import { AuthenticationMiddleware } from "../../shared/middlewares/authentication_middleware";
import { GenerateQRResult, SimpleQRResult } from "./qr_type";
import { errorMiddleware } from "../../shared/middlewares/error_middleware";

export class QRController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: QRService,
    private readonly prefix = "/qr",
  ) { }

  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(errorMiddleware)
      .use(new AuthenticationMiddleware(this.prisma).register())
      /**
       * POST /qr/generate
       * Generates a simple QR token for authenticated user (auto-detect active session).
       * @access Private (Authenticated User)
       */
      .post(
        "/generate",
        async ({ user, set }): Promise<SuccessResponse<SimpleQRResult>> => {
          const result = await this.service.generate_simple_qr(user.id);
          set.status = 200;
          return {
            code: 200,
            message: "Generate QR successful",
            result: result,
          };
        },
      )
      /**
       * POST /qr/generate-qr
       * Generates a single-use QR code for an authenticated user with specific session.
       * @access Private (Authenticated User)
       */
      .post(
        "/generate-qr",
        async ({
          user,
          body,
          set,
        }): Promise<SuccessResponse<GenerateQRResult>> => {
          const result = await this.service.generate_qr(
            user.id,
            body.session_id,
          );
          set.status = 200;
          return {
            code: 200,
            message: "Generate QR successful",
            result: result,
          };
        },
        {
          body: t.Object({
            session_id: t.String(),
          }),
        },
      )
      /**
       * GET /qr/status/:token
       * Checks if a QR code has been used.
       * @access Private (Authenticated User)
       */
      .get(
        "/status/:token",
        async ({ params, set }): Promise<SuccessResponse<{ is_used: boolean }>> => {
          const { token } = params;
          const result = await this.service.get_qr_status(token);
          set.status = 200;
          return {
            code: 200,
            message: "QR status retrieved successfully",
            result: result,
          };
        },
        {
          params: t.Object({
            token: t.String(),
          }),
        },
      );
}
