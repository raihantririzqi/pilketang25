import Elysia from "elysia";
import { UserRole } from "../types/custom_types";
import { AuthorizationError } from "../utils/error_util";

export class AuthorizationMiddleware {
  public static register = (
    role: UserRole,
    allowed_roles: UserRole[],
  ) =>
    new Elysia().derive(() => {
      if (!allowed_roles.includes(role))
        throw new AuthorizationError(
          `Role '${role}' does not have access to this resource`,
        );
    });
}
