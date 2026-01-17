import Elysia, { t } from "elysia";
import { PrismaClient } from "../../generated/prisma/client";
import { VotingService } from "./voting_service";
import { AuthorizationError } from "../../shared/utils/error_util";

export class ScannerController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: VotingService,
    private readonly prefix = "/voting/scanner",
  ) { }
  public register = () =>
    new Elysia({ prefix: this.prefix })
      .post(
        "/validate-qr",
        async ({ body, headers }) => {
          const scanner_secret =
            headers["X-Scanner-Secret"];
          if (scanner_secret !== process.env.SCANNER_SECRET)
            throw new AuthorizationError(
              "Invalid scanner secret key",
            );

          const { qr_token } = body;
          const result =
            await this.service.validate_qr(qr_token);
          return {
            code: 200,
            message: "QR code validated successfully",
            result: result,
          };
        },
        {
          body: t.Object({
            qr_token: t.String({
              minLength: 1,
              description: "QR token from scanned code",
            }),
            headers: t.Object({
              "X-Scanner-Secret": t.String({
                minLength: 1,
                description:
                  "Scanner authentication secret",
              }),
            }),
          }),
          detail: {
            tags: ["Scanner"],
            description: "Validate QR code for scanner",
            responses: {
              200: {
                description:
                  "QR code validated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "QR code validated successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            voting_token: {
                              type: "string",
                            },
                            candidates: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "string" },
                                  name: { type: "string" },
                                  vision: {
                                    type: "string",
                                  },
                                  mission: {
                                    type: "string",
                                  },
                                },
                              },
                            },
                            expires_in: {
                              type: "number",
                              example: 120,
                            },
                            session_id: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description: "QR validation failed",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 403,
                        },
                        message: {
                          type: "string",
                          example: "QR validation failed",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      )
      .post(
        "/submit",
        async ({ body, headers }) => {
          const scanner_secret =
            headers["X-Scanner-Secret"];
          if (scanner_secret !== process.env.SCANNER_SECRET)
            throw new AuthorizationError(
              "Invalid scanner secret key",
            );

          const { voting_token, candidate_id } = body;
          const result = await this.service.submit_vote(
            voting_token,
            candidate_id,
          );
          return {
            code: 200,
            message: "Vote recorded successfully",
            result: result,
          };
        },
        {
          body: t.Object({
            voting_token: t.String({
              minLength: 1,
              description: "Voting token from validation",
            }),
            candidate_id: t.String({
              minLength: 1,
              description: "ID of selected candidate",
            }),
          }),
          headers: t.Object({
            "X-Scanner-Secret": t.String({
              minLength: 1,
              description: "Scanner authentication secret",
            }),
          }),
          detail: {
            tags: ["Scanner"],
            description: "Submit vote after QR validation",
            responses: {
              200: {
                description: "Vote recorded successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 200,
                        },
                        message: {
                          type: "string",
                          example:
                            "Vote recorded successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            receipt_id: { type: "string" },
                            candidate_id: {
                              type: "string",
                            },
                            voted_at: {
                              type: "string",
                              format: "date-time",
                            },
                            session_id: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description: "Vote submission failed",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 403,
                        },
                        message: {
                          type: "string",
                          example: "Vote submission failed",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      );
}
