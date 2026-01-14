import { t } from "elysia";

const user_role_schema = t.Union([
  t.Literal("ADMIN"),
  t.Literal("COMMITTEE"),
  t.Literal("PARTICIPANT"),
]);

export const user_schema = t.Object({
  id: t.String(),
  google_id: t.String(),
  name: t.String(),
  email: t.String(),
  nim: t.String(),
  role: user_role_schema,
  created_at: t.Date(),
  updated_at: t.Date(),
});

export const update_role_body_schema = t.Object({
  role: user_role_schema,
});

export type User = typeof user_schema.static;
export type UpdateRoleBody = typeof update_role_body_schema.static;
