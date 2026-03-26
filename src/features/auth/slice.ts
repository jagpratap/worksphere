import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

import type { Role } from "@/constants";
import type { AuthTokens } from "@/types";

import type { AuthResponse, AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },

    updateAccessToken(state, action: PayloadAction<AuthTokens>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    setInitialized(state) {
      state.isInitialized = true;
    },

    // DEV-ONLY: Hot-swaps the user's role in Redux without signing out.
    setUserRole(state, action: PayloadAction<Role>) {
      if (state.user) {
        state.user = { ...state.user, role: action.payload };
      }
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  setCredentials,
  updateAccessToken,
  clearCredentials,
  setInitialized,
  setUserRole,
} = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectCurrentUserRole = (state: { auth: AuthState }) => state.auth.user?.role ?? null;
export const selectIsVerified = (state: { auth: AuthState }) => state.auth.user?.isVerified ?? false;

// ─── Reducer ──────────────────────────────────────────────────────────────────

export const authReducer = authSlice.reducer;
