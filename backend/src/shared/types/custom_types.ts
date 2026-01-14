import { t } from "elysia";

export type BaseResponse = {
  code: number;
  message: string;
};

// Menggabungkan BaseResponse dengan property tambahan
export type SuccessResponse<T> = BaseResponse & {
  result: T;
};

export type ErrorResponse = BaseResponse & {
  errors: string[];
};

export const user_role_schema = t.Union([
  t.Literal("ADMIN"),
  t.Literal("COMMITTEE"),
  t.Literal("PARTICIPANT"),
]);

export type UserRole = typeof user_role_schema.static;

export type UserContext = {
  id: string;
  role: UserRole;
  jti: string;
};
