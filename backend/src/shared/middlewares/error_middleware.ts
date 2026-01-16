import Elysia from "elysia";
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/error_util";
import { ErrorResponseFactory } from "../utils/response_util";

export const errorMiddleware = new Elysia({
  name: "ErrorMiddleware",
})
  .error({
    AUTHENTICATION: AuthenticationError,
    AUTHORIZATION: AuthorizationError,
    VALIDATION: ValidationError,
    NOT_FOUND: NotFoundError,
    CONFLICT: ConflictError,
  })
  .onError(({ code, error, set }) => {
    console.error(`[${new Date().toISOString()}] [${code}]:`, error);

    switch (code) {
      case "AUTHENTICATION": {
        set.status = 401;
        return ErrorResponseFactory.create({
          code: 401,
          message: error.message,
        });
      }
      case "AUTHORIZATION": {
        set.status = 403;
        return ErrorResponseFactory.create({
          code: 403,
          message: error.message,
        });
      }
      case "VALIDATION": {
        set.status = 400;
        return ErrorResponseFactory.create({
          code: 400,
          message: "Validation failed",
          errors: [error.message],
        });
      }
      case "NOT_FOUND": {
        set.status = 404;
        return ErrorResponseFactory.create({
          code: 404,
          message:
            error.message || "The requested endpoint or resource was not found",
        });
      }
      case "CONFLICT": {
        set.status = 409;
        return ErrorResponseFactory.create({
          code: 409,
          message: error.message,
          errors: [error.message],
        });
      }
      case "INTERNAL_SERVER_ERROR": {
        set.status = 500;
        return ErrorResponseFactory.create({
          code: 500,
          message: "An internal server error occurred.",
        });
      }
      default:
        set.status = 500;
        return ErrorResponseFactory.create({
          code: 500,
          message: "An unexpected error occurred",
        });
    }
  });

