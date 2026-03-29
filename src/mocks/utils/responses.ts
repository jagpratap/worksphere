import { HttpResponse } from "msw";

// ── Status Codes ────────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// ── Error Codes ─────────────────────────────────────────────────────────────

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_INVALID: "TOKEN_INVALID",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  ACCOUNT_DEACTIVATED: "ACCOUNT_DEACTIVATED",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_EXISTS: "RESOURCE_EXISTS",
  FORBIDDEN: "FORBIDDEN",
} as const;

// ── Common Error Messages ───────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  // Auth
  NO_TOKEN: "No token provided",
  INVALID_TOKEN: "Token invalid or expired",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_DEACTIVATED: "Your account has been deactivated. Contact an administrator.",
  REFRESH_TOKEN_REQUIRED: "Refresh token required",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  REFRESH_TOKEN_EXPIRED: "Refresh token expired",

  // Validation
  REQUIRED_FIELDS: "Missing required fields",
  INVALID_INPUT_DATA: "Invalid input data",
  UPDATES_ARRAY_REQUIRED: "Updates array is required",

  // Resources
  USER_NOT_FOUND: "User not found",
  USER_EXISTS: "An account with this email already exists",
  NOT_FOUND: "Resource not found",

  // Authorization
  FORBIDDEN: "You do not have permission to perform this action",

  // Verification
  ALREADY_VERIFIED: "User is already verified",
  INVALID_VERIFICATION_TOKEN: "Invalid verification token",
  VERIFICATION_TOKEN_EXPIRED: "Verification token expired, please request a new one",

  // Password reset
  INVALID_RESET_TOKEN: "Invalid token",
  RESET_TOKEN_EXPIRED: "Reset token has expired, please request a new one",
  RESET_LINK_SENT: "If this email is registered, a reset link has been sent",

  // Project
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_KEY_TAKEN: "A project with this key already exists",

  // Task
  TASK_NOT_FOUND: "Task not found",

  // Sprint
  SPRINT_NOT_FOUND: "Sprint not found",
  ACTIVE_SPRINT_EXISTS: "Only one active sprint is allowed per project",

  // Time entry
  TIME_ENTRY_NOT_FOUND: "Time entry not found",
} as const;

// ── Common Success Messages ───────────────────────────────────────────────────

export const SUCCESS_MESSAGES = {
  // Auth
  SIGN_IN_SUCCESS: "Sign in successful",
  ACCOUNT_CREATED: "Account created successfully",
  SIGNED_OUT: "Signed out successfully",
  PASSWORD_RESET: "Password reset successfully",
  VERIFICATION_SENT: "Verification email sent",
  EMAIL_VERIFIED: "Email verified successfully",

  // Project
  PROJECTS_FETCHED: "Projects fetched successfully",
  PROJECT_FETCHED: "Project fetched successfully",
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROJECT_DELETED: "Project deleted successfully",

  // Task
  TASKS_FETCHED: "Tasks fetched successfully",
  TASK_FETCHED: "Task fetched successfully",
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASKS_REORDERED: "Tasks reordered successfully",

  // Sprint
  SPRINTS_FETCHED: "Sprints fetched successfully",
  SPRINT_CREATED: "Sprint created successfully",
  SPRINT_UPDATED: "Sprint updated successfully",
  SPRINT_DELETED: "Sprint deleted successfully",

  // Time entry
  TIME_ENTRIES_FETCHED: "Time entries fetched successfully",
  TIME_ENTRY_CREATED: "Time entry created successfully",
  TIME_ENTRY_UPDATED: "Time entry updated successfully",
  TIME_ENTRY_DELETED: "Time entry deleted successfully",
} as const;

// ── Response Types ──────────────────────────────────────────────────────────

type SuccessBody = {
  success: true;
  data: unknown;
  message: string;
};

type ErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
};

type FieldError = {
  field: string;
  message: string;
};

// ── Response Helpers ────────────────────────────────────────────────────────

/**
 * @example
 * return successResponse({
 *   data: { user: sanitizeUser(user), accessToken },
 *   message: "Sign in successful",
 * });
 */
export function successResponse(
  options: { data: unknown; message: string; status?: number },
) {
  const body: SuccessBody = {
    success: true,
    data: options.data,
    message: options.message,
  };

  return HttpResponse.json(body, { status: options.status ?? HTTP_STATUS.OK });
}

/**
 * @example
 * return errorResponse({
 *   code: ERROR_CODES.INVALID_CREDENTIALS,
 *   message: ERROR_MESSAGES.INVALID_CREDENTIALS,
 *   status: HTTP_STATUS.UNAUTHORIZED,
 * });
 *
 * // With field-level validation errors
 * return errorResponse({
 *   code: ERROR_CODES.VALIDATION_ERROR,
 *   message: "Invalid input data",
 *   status: HTTP_STATUS.BAD_REQUEST,
 *   details: [
 *     { field: "email", message: "Must be a valid email address" },
 *   ],
 * });
 */
export function errorResponse(
  options: { code: string; message: string; status: number; details?: FieldError[] },
) {
  const body: ErrorBody = {
    success: false,
    error: {
      code: options.code,
      message: options.message,
      ...(options.details && { details: options.details }),
    },
  };

  return HttpResponse.json(body, { status: options.status });
}
