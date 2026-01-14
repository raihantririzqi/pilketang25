/**
 * Base class for all domain-specific errors.
 */
export class AppError extends Error {
  public constructor(message: string, name: string) {
    super(message);
  }
}

/**
 * Thrown when JWT authentication fails or token is missing.
 */
export class AuthenticationError extends AppError {
  public constructor(message: string) {
    super(message, "AuthenticationError");
  }
}

/**
 * Thrown when a user does not have the required role (RBAC).
 */
export class AuthorizationError extends AppError {
  public constructor(
    message: string = "You do not have permission to perform this action",
  ) {
    super(message, "AuthorizationError");
  }
}

/**
 * Thrown when input validation fails (TypeBox or Business Logic).
 */
export class ValidationError extends AppError {
  public errors: string[];

  public constructor(message: string, errors: string[] = []) {
    super(message, "ValidationError");
    this.errors = errors.length > 0 ? errors : [message];
  }
}

/**
 * Thrown when a requested resource (e.g., Voting Session) is not found.
 */
export class NotFoundError extends AppError {
  public constructor(message: string) {
    super(message, "NotFoundError");
  }
}

/**
 * Thrown when a business rule is violated (e.g., voting twice).
 */
export class ConflictError extends AppError {
  public constructor(message: string) {
    super(message, "ConflictError");
  }
}
