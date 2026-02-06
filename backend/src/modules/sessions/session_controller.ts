import Elysia, { t } from "elysia";
import { PrismaClient } from "../../generated/prisma/client";
import { AuthenticationMiddleware } from "../../shared/middlewares/authentication_middleware";
import { AuthorizationMiddleware } from "../../shared/middlewares/authorization_middleware";
import { SessionService } from "./session_service";

export class SessionController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: SessionService,
    private readonly prefix = "/sessions",
  ) { }

  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(
        new AuthenticationMiddleware(
          this.prisma,
        ).register(),
      )
      /**
       * @endpoint POST /api/sessions/:id/publish
       * @desc Publish voting results for a session with OTP verification
       */
      .post(
        "/:id/publish",
        async ({ params, user }) => {
          const result = await this.service.publish_results(
            params.id,
            user.id,
          );
          return {
            code: 200,
            message: "Results published successfully",
            result,
          };
        },
        {
          params: t.Object({
            id: t.String({
              description: "Voting session ID",
            }),
          }),
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, [
              "COMMITTEE",
            ]),
          detail: {
            tags: ["Sessions"],
            description:
              "Publish voting results with OTP verification",
            security: [{ bearerAuth: [] }],
            responses: {
              200: {
                description:
                  "Results published successfully",
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
                            "Results published successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            session_id: {
                              type: "string",
                              example:
                                "sess_123e4567-e89b-12d3-a456-426614174000",
                            },
                            is_published: {
                              type: "boolean",
                              example: true,
                            },
                            published_at: {
                              type: "string",
                              format: "date-time",
                              example:
                                "2026-01-16T14:30:00.000Z",
                            },
                            total_votes: {
                              type: "number",
                              example: 42,
                            },
                            total_candidates: {
                              type: "number",
                              example: 3,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized - Invalid OTP",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 401,
                        },
                        message: {
                          type: "string",
                          example: "Invalid OTP",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "OTP verification failed",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description:
                  "Forbidden - Session already published",
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
                          example: "Forbidden",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "Results already published",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              404: {
                description:
                  "Not Found - Session not found",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 404,
                        },
                        message: {
                          type: "string",
                          example: "Resource not found",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "Voting session not found",
                          ],
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
      /**
       * @endpoint GET /api/sessions/:id/results
       * @desc Get voting results for a specific session
       */
      .get(
        "/:id/results",
        async ({ params, user }) => {
          const is_committee = user.role === "COMMITTEE";
          const result =
            await this.service.get_session_results(
              params.id,
              is_committee,
            );
          return {
            code: 200,
            message:
              "Voting results retrieved successfully",
            result,
          };
        },
        {
          params: t.Object({
            id: t.String({
              description: "Voting session ID",
            }),
          }),
          detail: {
            tags: ["Sessions"],
            description: "Get voting results for a session",
            security: [{ bearerAuth: [] }],
            responses: {
              200: {
                description:
                  "Voting results retrieved successfully",
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
                            "Voting results retrieved successfully",
                        },
                        result: {
                          type: "object",
                          properties: {
                            session_id: {
                              type: "string",
                              example:
                                "sess_123e4567-e89b-12d3-a456-426614174000",
                            },
                            is_published: {
                              type: "boolean",
                              example: false,
                            },
                            total_votes: {
                              type: "number",
                              example: 42,
                            },
                            results: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  candidate_id: {
                                    type: "string",
                                    example:
                                      "cand_123e4567-e89b-12d3-a456-426614174000",
                                  },
                                  candidate_name: {
                                    type: "string",
                                    example: "John Doe",
                                  },
                                  vote_count: {
                                    type: "number",
                                    example: 25,
                                  },
                                  percentage: {
                                    type: "number",
                                    example: 59.52,
                                  },
                                },
                              },
                            },
                            published_at: {
                              type: "string",
                              format: "date-time",
                              nullable: true,
                              example:
                                "2026-01-16T14:30:00.000Z",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description:
                  "Forbidden - Results not published yet",
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
                          example:
                            "Results not published yet",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "Voting results have not been published yet",
                          ],
                        },
                      },
                    },
                  },
                },
              },
              404: {
                description:
                  "Not Found - Session not found",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        code: {
                          type: "number",
                          example: 404,
                        },
                        message: {
                          type: "string",
                          example: "Resource not found",
                        },
                        errors: {
                          type: "array",
                          items: { type: "string" },
                          example: [
                            "Voting session not found",
                          ],
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
