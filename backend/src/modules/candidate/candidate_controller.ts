import Elysia, { t } from "elysia";
import { CandidateService } from "./candidate_service";
import { AuthenticationMiddleware } from "../../shared/middlewares/authentication_middleware";
import { PrismaClient } from "../../generated/prisma/client";
import { SuccessResponse } from "../../shared/types/custom_types";
import {
  create_candidate_schema,
  GetAllCandidatesResponse,
  update_candidate_schema,
} from "./candidate_type";
import { AuthorizationMiddleware } from "../../shared/middlewares/authorization_middleware";

export class CandidateController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: CandidateService,
    private readonly prefix = "/candidates",
  ) {}

  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(new AuthenticationMiddleware(this.prisma).register())
      .get(
        "/",
        async (): Promise<
          SuccessResponse<GetAllCandidatesResponse>
        > => {
          const result = await this.service.get_all_candidates();
          return {
            code: 200,
            message: "List all candidates",
            result: result,
          };
        },
        { detail: { summary: "List all candidates for voting" } },
      )
      .post(
        "/",
        async ({ body }) => {
          const result = await this.service.create_candidate(
            body as any,
          );
          return {
            code: 200,
            message: "Candidate created successful",
            result: result,
          };
        },
        {
          body: create_candidate_schema,
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, [
              "ADMIN",
              "COMMITTEE",
            ]),
          detail: {
            summary: "Register a new candidate (Admin Only)",
          },
        },
      )
      .patch(
        "/:id",
        async ({ params: { id }, body }) => {
          const result = await this.service.update_candidate(
            id,
            body,
          );
          return {
            code: 200,
            message: "Candidate updated successful",
            result: result,
          };
        },
        {
          params: t.Object({ id: t.String() }),
          body: update_candidate_schema,
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, ["ADMIN"]),
          detail: { summary: "Update candidate profile" },
        },
      )
      .delete(
        "/:id",
        async ({ params: { id } }) => {
          const result = await this.service.delete_candidate(id);
          return {
            code: 200,
            message: "Candidate deleted successful",
            result: result,
          };
        },
        {
          params: t.Object({ id: t.String() }),
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, [
              "ADMIN",
              "COMMITTEE",
            ]),
          detail: { summary: "Remove candidate" },
        },
      );
}
