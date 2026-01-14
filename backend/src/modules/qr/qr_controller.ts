import Elysia, { t } from "elysia";
import { PrismaClient } from "../../generated/prisma/client";
import { QRService } from "./qr_service";
import {
  BaseResponse,
  SuccessResponse,
} from "../../shared/types/custom_types";
import { AuthenticationMiddleware } from "../../shared/middlewares/authentication_middleware";
import { GenerateQRResult } from "./qr_type";

export class QRController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: QRService,
    private readonly prefix = "/qr",
  ) {}

  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(new AuthenticationMiddleware(this.prisma).register())
      /**
       * POST /voting/generate-qr
       * Generates a single-use QR code for an authenticated user.
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
      );
}
