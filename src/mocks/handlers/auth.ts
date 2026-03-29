import { http } from "msw";

import { DEFAULT_ROLE } from "@/config/roles";
import { ROLES, USER_STATUS } from "@/constants";

import type { MockUser } from "../fixtures/users.ts";

import { sanitizeUser, withAuth, withRole } from "../utils/auth.ts";
import {
  AUTH_BASE_URL,
  EMAIL_VERIFY_TTL_MS,
  PASSWORD_RESET_TTL_MS,
  REFRESH_ROTATE_MS,
  REFRESH_TOKEN_TTL_MS,
  USERS_BASE_URL,
} from "../utils/constants.ts";
import { delay } from "../utils/delay.ts";
import { signToken } from "../utils/jwt.ts";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  errorResponse,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  successResponse,
} from "../utils/responses.ts";
import { mswStore } from "../utils/store-persistence.ts";

/* =============================================================================
  Public handlers
============================================================================= */

// ── POST /api/auth/signin ─────────────────────────────────────────────────────
const signIn = http.post(`${AUTH_BASE_URL}/signin`, async ({ request }) => {
  await delay();

  const { email, password } = await request.json() as { email: string; password: string };

  if (!email || !password) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ERROR_MESSAGES.REQUIRED_FIELDS,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const user = mswStore.findUserByEmail(email);

  if (!user || user.password !== password) {
    return errorResponse({
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  if (user.status === USER_STATUS.DEACTIVATED) {
    return errorResponse({
      code: ERROR_CODES.ACCOUNT_DEACTIVATED,
      message: ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
      status: HTTP_STATUS.FORBIDDEN,
    });
  }

  const accessToken = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = crypto.randomUUID();
  mswStore.setRefreshToken(refreshToken, { userId: user.id, createdAt: Date.now() });

  return successResponse({
    data: { accessToken, refreshToken, user: sanitizeUser(user) },
    message: SUCCESS_MESSAGES.SIGN_IN_SUCCESS,
  });
});

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
const signUp = http.post(`${AUTH_BASE_URL}/signup`, async ({ request }) => {
  await delay();

  const { email, password, name } = await request.json() as { email: string; password: string; name: string };

  if (!email || !password || !name) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ERROR_MESSAGES.REQUIRED_FIELDS,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const existingUser = mswStore.findUserByEmail(email);

  if (existingUser) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_EXISTS,
      message: ERROR_MESSAGES.USER_EXISTS,
      status: HTTP_STATUS.CONFLICT,
    });
  }

  const now = new Date().toISOString();

  const newUser: MockUser = {
    id: `usr_${crypto.randomUUID().slice(0, 6)}`,
    name,
    email,
    password,
    role: DEFAULT_ROLE,
    status: USER_STATUS.ACTIVE,
    isVerified: false,
    createdAt: now,
    lastActiveAt: now,
  };

  mswStore.addUser(newUser);

  const accessToken = await signToken({
    sub: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  const refreshToken = crypto.randomUUID();
  mswStore.setRefreshToken(refreshToken, { userId: newUser.id, createdAt: Date.now() });

  return successResponse({
    data: { accessToken, refreshToken, user: sanitizeUser(newUser) },
    message: SUCCESS_MESSAGES.ACCOUNT_CREATED,
    status: HTTP_STATUS.CREATED,
  });
});

// ── POST /api/auth/signout ────────────────────────────────────────────────────
const signOut = http.post(`${AUTH_BASE_URL}/signout`, async ({ request }) => {
  await delay("instant");

  const { refreshToken } = await request.json() as { refreshToken?: string };

  if (refreshToken) {
    mswStore.deleteRefreshToken(refreshToken);
  }

  return successResponse({
    data: {},
    message: SUCCESS_MESSAGES.SIGNED_OUT,
  });
});

// ── POST /api/auth/refresh ─────────────────────────────────────────────────────
const refresh = http.post(`${AUTH_BASE_URL}/refresh`, async ({ request }) => {
  await delay("instant");

  const { refreshToken } = await request.json() as { refreshToken: string };

  if (!refreshToken) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const storedToken = mswStore.getRefreshToken(refreshToken);

  if (!storedToken) {
    return errorResponse({
      code: ERROR_CODES.TOKEN_INVALID,
      message: ERROR_MESSAGES.REFRESH_TOKEN_INVALID,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const { userId, createdAt } = storedToken;

  const age = Date.now() - createdAt;
  const isExpired = age > REFRESH_TOKEN_TTL_MS;
  const isCloseToExpiry = age > (REFRESH_TOKEN_TTL_MS - REFRESH_ROTATE_MS);

  if (isExpired) {
    mswStore.deleteRefreshToken(refreshToken);
    return errorResponse({
      code: ERROR_CODES.TOKEN_EXPIRED,
      message: ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const user = mswStore.findUserById(userId);

  if (!user) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: ERROR_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND,
    });
  }

  if (user.status === USER_STATUS.DEACTIVATED) {
    mswStore.deleteRefreshToken(refreshToken);
    return errorResponse({
      code: ERROR_CODES.ACCOUNT_DEACTIVATED,
      message: ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
      status: HTTP_STATUS.FORBIDDEN,
    });
  }

  const accessToken = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  let activeRefreshToken = refreshToken;

  if (isCloseToExpiry) {
    mswStore.deleteRefreshToken(refreshToken);
    activeRefreshToken = crypto.randomUUID();
    mswStore.setRefreshToken(activeRefreshToken, { userId, createdAt: Date.now() });
  }

  return successResponse({
    data: { accessToken, refreshToken: activeRefreshToken },
    message: "Token refreshed successfully",
  });
});

// ── POST /api/auth/forgot-password ─────────────────────────────────────────────────────
const forgotPassword = http.post(`${AUTH_BASE_URL}/forgot-password`, async ({ request }) => {
  await delay();

  const { email } = await request.json() as { email: string };

  if (!email) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ERROR_MESSAGES.REQUIRED_FIELDS,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const user = mswStore.findUserByEmail(email);

  if (!user) {
    // Same response whether user exists or not — prevents email enumeration
    return successResponse({
      data: {},
      message: ERROR_MESSAGES.RESET_LINK_SENT,
    });
  }

  const resetToken = crypto.randomUUID();
  mswStore.setPasswordResetToken(email, {
    token: resetToken,
    expiresAt: Date.now() + PASSWORD_RESET_TTL_MS,
  });

  // eslint-disable-next-line no-console
  console.info(`[MSW] Password reset link: /reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);

  return successResponse({
    data: { __devResetToken: resetToken },
    message: ERROR_MESSAGES.RESET_LINK_SENT,
  });
});

// ── POST /api/auth/reset-password ─────────────────────────────────────────────────────
const resetPassword = http.post(`${AUTH_BASE_URL}/reset-password`, async ({ request }) => {
  await delay();

  const { email, token, newPassword } = await request.json() as { email: string; token: string; newPassword: string };

  if (!email || !token || !newPassword) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ERROR_MESSAGES.REQUIRED_FIELDS,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const stored = mswStore.getPasswordResetToken(email);

  if (!stored || stored.token !== token) {
    return errorResponse({
      code: ERROR_CODES.TOKEN_INVALID,
      message: ERROR_MESSAGES.INVALID_RESET_TOKEN,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const isExpired = Date.now() > stored.expiresAt;

  if (isExpired) {
    mswStore.deletePasswordResetToken(email);
    return errorResponse({
      code: ERROR_CODES.TOKEN_EXPIRED,
      message: ERROR_MESSAGES.RESET_TOKEN_EXPIRED,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const user = mswStore.findUserByEmail(email);

  if (!user) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: ERROR_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND,
    });
  }

  mswStore.updateUser(user.id, { password: newPassword });
  mswStore.deletePasswordResetToken(email);

  return successResponse({
    data: {},
    message: SUCCESS_MESSAGES.PASSWORD_RESET,
  });
});

// ── POST /api/auth/send-verification ─────────────────────────────────────────────────────
const sendVerification = http.post(`${AUTH_BASE_URL}/send-verification`, async ({ request }) => {
  await delay();

  const { email } = await request.json() as { email: string };

  const user = mswStore.findUserByEmail(email);

  if (!user) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: ERROR_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND,
    });
  }

  if (user.isVerified) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_EXISTS,
      message: ERROR_MESSAGES.ALREADY_VERIFIED,
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const token = crypto.randomUUID();
  mswStore.setEmailVerificationToken(email, {
    token,
    expiresAt: Date.now() + EMAIL_VERIFY_TTL_MS,
  });

  // eslint-disable-next-line no-console
  console.info(`[MSW] Verification link: /verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);

  return successResponse({
    data: { __devVerificationToken: token },
    message: SUCCESS_MESSAGES.VERIFICATION_SENT,
  });
});

// ── POST /api/auth/verify-email ─────────────────────────────────────────────────────
const verifyEmail = http.post(`${AUTH_BASE_URL}/verify-email`, async ({ request }) => {
  await delay("fast");

  const { email, token } = await request.json() as { email: string; token: string };

  const user = mswStore.findUserByEmail(email);

  if (!user) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: ERROR_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND,
    });
  }

  if (user.isVerified) {
    return errorResponse({
      code: ERROR_CODES.RESOURCE_EXISTS,
      message: ERROR_MESSAGES.ALREADY_VERIFIED,
      status: HTTP_STATUS.CONFLICT,
    });
  }

  const stored = mswStore.getEmailVerificationToken(email);

  if (!stored || stored.token !== token) {
    return errorResponse({
      code: ERROR_CODES.TOKEN_INVALID,
      message: ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const isExpired = Date.now() > stored.expiresAt;

  if (isExpired) {
    mswStore.deleteEmailVerificationToken(email);
    return errorResponse({
      code: ERROR_CODES.TOKEN_EXPIRED,
      message: ERROR_MESSAGES.VERIFICATION_TOKEN_EXPIRED,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  mswStore.updateUser(user.id, { isVerified: true });
  mswStore.deleteEmailVerificationToken(email);

  return successResponse({
    data: {},
    message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
  });
});

/* =============================================================================
  With auth handlers
============================================================================= */

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
const me = http.get(
  `${AUTH_BASE_URL}/me`,
  withAuth(async ({ user }) => {
    await delay("fast");
    return successResponse({
      data: { user: sanitizeUser(user) },
      message: "User fetched successfully",
    });
  }),
);

// ── GET /api/auth/verification-status ─────────────────────────────────────────────────────
const verificationStatus = http.get(
  `${AUTH_BASE_URL}/verification-status`,
  withAuth(async ({ user }) => {
    await delay("fast");
    return successResponse({
      data: { isVerified: user.isVerified },
      message: "Verification status fetched successfully",
    });
  }),
);

// ── GET /api/users ──────────────────────────────────────────────────────────
const getUsers = http.get(
  USERS_BASE_URL,
  withRole([ROLES.ADMIN, ROLES.MANAGER], async () => {
    await delay();

    const users = mswStore.getUsers()
      .filter(u => u.status === USER_STATUS.ACTIVE)
      .map(sanitizeUser);

    return successResponse({
      data: users,
      message: "Users fetched successfully",
    });
  }),
);

export const authHandlers = [
  me,
  getUsers,
  signIn,
  signUp,
  signOut,
  refresh,
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyEmail,
  verificationStatus,
];
