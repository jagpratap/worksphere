import type { Role } from "@/constants";

import { USER_STATUS } from "@/constants";

import type { MockUser } from "../fixtures/users";
import type { JWTPayload } from "./jwt";

import { extractBearer, verifyToken } from "./jwt";
import { ERROR_CODES, ERROR_MESSAGES, errorResponse, HTTP_STATUS } from "./responses";
import { mswStore } from "./store-persistence";

type AuthContext = {
  claims: JWTPayload;
  user: MockUser;
};

type ProtectedHandler = (
  ctx: AuthContext,
  request: Request,
) => Promise<Response>;

export function withAuth(handler: ProtectedHandler) {
  return async ({ request }: { request: Request }) => {
    const token = extractBearer(request.headers.get("Authorization"));

    if (!token) {
      return errorResponse({
        code: ERROR_CODES.TOKEN_INVALID,
        message: ERROR_MESSAGES.NO_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const claims = await verifyToken(token);

    if (!claims) {
      return errorResponse({
        code: ERROR_CODES.TOKEN_INVALID,
        message: ERROR_MESSAGES.INVALID_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const user = mswStore.findUserById(claims.sub);

    if (!user) {
      return errorResponse({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (user.status === USER_STATUS.DEACTIVATED) {
      return errorResponse({
        code: ERROR_CODES.ACCOUNT_DEACTIVATED,
        message: ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    return handler({ claims, user }, request);
  };
}

export function withRole(roles: Role[], handler: ProtectedHandler) {
  return withAuth(async (ctx, request) => {
    if (!roles.includes(ctx.user.role)) {
      return errorResponse({
        code: ERROR_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    return handler(ctx, request);
  });
}

export function sanitizeUser(user: MockUser) {
  const { password: _, ...rest } = user;
  return rest;
}
