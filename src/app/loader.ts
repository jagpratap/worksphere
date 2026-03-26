import type { MeResponse, RefreshResponse } from "@/features/auth";
import type { ApiSuccessResponse } from "@/types";

import { ENV } from "@/config/env";
import {
  clearCredentials,
  selectIsInitialized,
  setCredentials,
  setInitialized,
} from "@/features/auth";
import { store } from "@/store";
import { tokenStorage } from "@/store/local-storage";

export async function rootLoader() {
  const isInitialized = selectIsInitialized(store.getState());

  if (isInitialized)
    return null;

  const refreshToken = tokenStorage.get();

  if (!refreshToken) {
    store.dispatch(setInitialized());
    return null;
  }

  try {
    // ── Step 1: Exchange stored refresh token for a fresh pair ──────────────
    const refreshRes = await fetch(`${ENV.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok)
      throw new Error("Refresh failed");

    const { data: refreshData } = await refreshRes.json() as ApiSuccessResponse<RefreshResponse>;

    const { accessToken, refreshToken: newRefreshToken } = refreshData;

    tokenStorage.set(newRefreshToken);

    // ── Step 2: Fetch the current user with the brand-new access token ───────
    const meRes = await fetch(`${ENV.API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!meRes.ok)
      throw new Error("Me failed");

    const { data: meData } = await meRes.json() as ApiSuccessResponse<MeResponse>;

    const { user } = meData;

    // ── Step 3: Populate Redux in a single, atomic dispatch ──────────────────
    store.dispatch(
      setCredentials({
        user,
        accessToken,
        refreshToken: newRefreshToken,
      }),
    );
  }
  catch {
    tokenStorage.clear();
    store.dispatch(clearCredentials());
  }
  finally {
    store.dispatch(setInitialized());
  }

  return null;
}
