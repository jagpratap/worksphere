import type { ApiErrorResponse, FieldError, FieldErrors } from "@/types";

// ── ApiException ────────────────────────────────────────────────────────────

export class ApiException<T = unknown> extends Error {
  status: number;
  code: string;
  fieldErrors: FieldErrors<T>;

  constructor(options: {
    message: string;
    status: number;
    code?: string;
    fieldErrors?: FieldErrors<T>;
  }) {
    super(options.message);
    this.name = "ApiException";
    this.status = options.status;
    this.code = options.code ?? "UNKNOWN_ERROR";
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

// ── Parsers ─────────────────────────────────────────────────────────────────

/**
 * Converts the details array from the API envelope into a flat record
 * keyed by field name. Ready to pass into React Hook Form's setError().
 *
 * [{ field: "email", message: "Required" }] → { email: "Required" }
 */
function toFieldErrors(details?: FieldError[]): FieldErrors {
  if (!details?.length)
    return {};
  return Object.fromEntries(details.map(d => [d.field, d.message]));
}

/**
 * Parses any error shape into a consistent ApiException.
 *
 * Handles three cases:
 * 1. RTK Query FetchBaseQueryError — { status, data: ApiErrorResponse }
 * 2. Already an ApiException — returns as-is
 * 3. Generic JS Error / unknown — wraps in a 500 ApiException
 *
 * @example
 * try {
 *   await createTask(values).unwrap();
 * } catch (err) {
 *   const parsed = parseApiError(err);
 *   toast.error(parsed.message);
 *   // Set field errors on the form
 *   Object.entries(parsed.fieldErrors).forEach(([field, msg]) =>
 *     form.setError(field, { message: msg })
 *   );
 * }
 */
export function parseApiError<T = unknown>(error: unknown): ApiException<T> {
  if (isRtkError(error)) {
    const { status, data } = error as { status: number; data: ApiErrorResponse };
    const envelope = data?.error;

    return new ApiException({
      message: envelope?.message ?? "Something went wrong",
      status: typeof status === "number" ? status : 500,
      code: envelope?.code,
      fieldErrors: toFieldErrors(envelope?.details),
    });
  }

  if (error instanceof ApiException)
    return error;

  if (error instanceof Error) {
    return new ApiException({ message: error.message, status: 500 });
  }

  return new ApiException({ message: "Something went wrong", status: 500 });
}

// ── Status Code Helpers ─────────────────────────────────────────────────────

export const isUnauthorized = (error: unknown) => parseApiError(error).status === 401;
export const isForbidden = (error: unknown) => parseApiError(error).status === 403;
export const isNotFound = (error: unknown) => parseApiError(error).status === 404;
export const isConflict = (error: unknown) => parseApiError(error).status === 409;
export const isValidationError = (error: unknown) => parseApiError(error).code === "VALIDATION_ERROR";
export const isServerError = (error: unknown) => parseApiError(error).status >= 500;

// ── Internal ────────────────────────────────────────────────────────────────

function isRtkError(error: unknown): boolean {
  return (
    typeof error === "object"
    && error !== null
    && "data" in error
    && "status" in error
  );
}
