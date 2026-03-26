import type { AuthTokens, SafeUser } from "@/types";

// ─── Auth State ───────────────────────────────────────────────────────────────

export type AuthState = {
  user: SafeUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

// ─── Response types ─────────────────────────────────────────────────────────────

export type AuthResponse = AuthTokens & {
  user: SafeUser;
};

export type RefreshResponse = AuthTokens;

export type MeResponse = {
  user: SafeUser;
};

export type MessageResponse = {
  message: string;
};

export type ForgotPasswordResponse = MessageResponse & {
  __devResetToken?: string;
};

export type SendVerificationResponse = MessageResponse & {
  __devVerificationToken?: string;
};

export type VerificationStatusResponse = {
  isVerified: boolean;
};

// ─── Request types ──────────────────────────────────────────────────────────

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  newPassword: string;
};

export type SendVerificationRequest = {
  email: string;
};

export type VerifyEmailRequest = {
  email: string;
  token: string;
};
