import {
  ErrorResponse,
  SuccessResponse,
} from "../types/custom_types";

export class SuccessResponseFactory {
  static create = <T>({
    result,
    code = 200,
    message = "Operation successful",
  }: {
    result: T;
    code?: number;
    message?: string;
  }): SuccessResponse<T> => ({
    code,
    message,
    result,
  });
}

export class ErrorResponseFactory {
  static create = ({
    errors = [],
    code = 500,
    message = "Internal server error",
  }: {
    errors?: string[];
    code?: number;
    message?: string;
  } = {}): ErrorResponse => ({
    code,
    message,
    errors,
  });
}
