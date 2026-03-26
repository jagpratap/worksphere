// ── Response Envelope ────────────────────────────────────────────────────────
// Mirrors the MSW backend envelope from mocks/utils/responses.ts

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
};

export type FieldError = {
  field: string;
  message: string;
};

// ── Auth Tokens ─────────────────────────────────────────────────────────────

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// ── Field Errors (mapped to form fields) ────────────────────────────────────

export type FieldErrors<T = unknown> = Partial<
  Record<keyof T extends string ? keyof T : string, string>
>;
