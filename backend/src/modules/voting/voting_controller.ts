import Elysia, { t } from "elysia";
import { VotingService } from "./voting_service";
import { SuccessResponse } from "../../shared/types/custom_types";
import { PrismaClient } from "../../generated/prisma/client";
import { ScannerMiddleware } from "../../shared/middlewares/scanner_middleware";
import {
  QRValidationResult,
  SubmitVoteResult,
} from "./voting_type";

/**
 * Controller handling HTTP endpoints for the voting process.
 * Manages the flow from QR generation to final vote submission.
 */
export class VotingController {
  public constructor(
    private readonly service: VotingService,
    private readonly prefix = "/voting",
  ) {}

  /**
   * Registers voting-related routes into the Elysia application instance.
   * Includes authentication middleware and strict payload validation.
   *
   * @returns An Elysia instance with configured voting routes.
   */
  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(ScannerMiddleware.register())
      /**
       * POST /voting/validate-qr
       * Validates a scanned QR token and returns the candidate list.
       * @access Public (Booth Scanner)
       */
      .post(
        "/validate-qr",
        async ({
          body,
          set,
        }): Promise<
          SuccessResponse<QRValidationResult>
        > => {
          const result = await this.service.validate_qr(
            body.qr_token,
          );
          return {
            code: 200,
            message: "Validate QR successful",
            result: result,
          };
        },
        {
          body: t.Object({
            qr_token: t.String(),
          }),
        },
      )
      /**
       * POST /voting/submit
       * Submits an anonymous vote using a temporary voting token.
       * @access Public (Voting Booth)
       */
      .post(
        "/submit",
        async ({
          body,
          set,
        }): Promise<SuccessResponse<SubmitVoteResult>> => {
          const result = await this.service.submit_vote(
            body.voting_token,
            body.candidate_id,
          );
          return {
            code: 200,
            message:
              "Your vote has been recorded anonymously. Thank you!",
            result: result,
          };
        },
        {
          body: t.Object({
            voting_token: t.String(),
            candidate_id: t.String({ format: "uuid" }),
          }),
        },
      );
}
