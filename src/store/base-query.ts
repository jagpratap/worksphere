import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { ApiSuccessResponse, AuthTokens } from "@/types";

import { ENV } from "@/config/env";
import {
  clearCredentials,
  selectAccessToken,
  selectRefreshToken,
  updateAccessToken,
} from "@/features/auth";

import type { RootState } from ".";

import { tokenStorage } from "./local-storage";

/* =========================================================
   Base Queries
========================================================= */

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const publicBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
});

/* =============================================================================
  Refresh Queue
============================================================================= */

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let requestQueue: QueueItem[] = [];

function processQueue(error: unknown, newToken: string | null = null) {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error || !newToken)
      reject(error);
    else resolve(newToken);
  });
  requestQueue = [];
}

function enqueue(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    requestQueue.push({ resolve, reject });
  });
}

/* =========================================================
   Helper: Inject token manually
========================================================= */

function injectToken(args: string | FetchArgs, token: string): FetchArgs {
  const base: FetchArgs
    = typeof args === "string" ? { url: args } : { ...args };

  return {
    ...base,
    headers: {
      ...(base.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    },
  };
}

/* =========================================================
   Base Query Wrapper (Reauth Interceptor)
========================================================= */

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401)
    return result;

  const refreshToken = selectRefreshToken(api.getState() as RootState);

  if (!refreshToken) {
    api.dispatch(clearCredentials());
    tokenStorage.clear();
    return result;
  }

  // ── Another refresh already in flight ─────────────────────────────────────
  if (isRefreshing) {
    try {
      const newToken = await enqueue();

      result = await baseQuery(
        injectToken(args, newToken),
        api,
        extraOptions,
      );
    }
    catch {
      // Refresh failed while queued — return original 401
    }
    return result;
  }

  // ── Start the refresh for the first time ────────────────────────────────────
  isRefreshing = true;

  try {
    const refreshResult = await publicBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const response = refreshResult.data as ApiSuccessResponse<AuthTokens>;
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      api.dispatch(updateAccessToken({ accessToken, refreshToken: newRefreshToken }));
      tokenStorage.set(newRefreshToken);

      processQueue(null, accessToken);

      result = await baseQuery(args, api, extraOptions);
    }
    else {
      processQueue(refreshResult.error, null);
      api.dispatch(clearCredentials());
      tokenStorage.clear();
    }
  }
  catch (err) {
    processQueue(err, null);
    api.dispatch(clearCredentials());
    tokenStorage.clear();
  }
  finally {
    isRefreshing = false;
  }

  return result;
};
