import Elysia, { t } from "elysia";
import { UserService } from "./user_service";
import { PrismaClient } from "../../generated/prisma/client";
import { AuthenticationMiddleware } from "../../shared/middlewares/authentication_middleware";
import { AuthorizationMiddleware } from "../../shared/middlewares/authorization_middleware";
import { user_role_schema } from "../../shared/types/custom_types";

export class UserController {
  public constructor(
    private readonly prisma: PrismaClient,
    private readonly service: UserService,
    private readonly prefix = "/users",
  ) {}

  public register = () =>
    new Elysia({ prefix: this.prefix })
      .use(new AuthenticationMiddleware(this.prisma).register())
      .get("/", async () => await this.service.get_all_users(), {
        beforeHandle: ({ user }) =>
          AuthorizationMiddleware.register(user.role, [
            "ADMIN",
            "COMMITTEE",
          ]),
      })
      .get(
        "/:id",
        async ({ params: { id } }) =>
          await this.service.get_user_by_id(id),
        {
          params: t.Object({
            id: t.String(),
          }),
        },
      )
      .patch(
        "/:id/role",
        async ({ params, body }) =>
          await this.service.update_role(params.id, body.role),
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            role: user_role_schema,
          }),
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, ["ADMIN"]),
        },
      )
      .delete(
        "/:id",
        async ({ params }) =>
          await this.service.delete_user(params.id),
        {
          params: t.Object({
            id: t.String(),
          }),
          beforeHandle: ({ user }) =>
            AuthorizationMiddleware.register(user.role, ["ADMIN"]),
        },
      );
}
