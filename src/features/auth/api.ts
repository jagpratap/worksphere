import type { ApiSuccessResponse } from "@/types";

import { baseApi } from "@/store/base-api";
import { tokenStorage } from "@/store/local-storage";

import type {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  MeResponse,
  MessageResponse,
  ResetPasswordRequest,
  SendVerificationRequest,
  SendVerificationResponse,
  SignInRequest,
  SignUpRequest,
  VerificationStatusResponse,
  VerifyEmailRequest,
} from "./types";

import { clearCredentials, setCredentials } from "./slice";

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // ── POST /api/auth/signin ─────────────────────────────────────────────────────
    signIn: builder.mutation<ApiSuccessResponse<AuthResponse>, SignInRequest>({
      query: body => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const { data } = response.data;

          dispatch(setCredentials(data));
          tokenStorage.set(data.refreshToken);
        }
        catch {
          // Error still surfaces at the call site (via isError or .unwrap())
        }
      },
    }),

    // ── POST /api/auth/signup ─────────────────────────────────────────────────────
    signUp: builder.mutation<ApiSuccessResponse<AuthResponse>, SignUpRequest>({
      query: body => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const { data } = response.data;

          dispatch(setCredentials(data));
          tokenStorage.set(data.refreshToken);
        }
        catch {
          // Error still surfaces at the call site (via isError or .unwrap())
        }
      },
    }),

    // ── POST /api/auth/signout ─────────────────────────────────────────────────────
    signOut: builder.mutation<MessageResponse, void>({
      queryFn: async (_arg, { dispatch }, _extraOptions, baseQuery) => {
        /*
        * Optimistic: clear local state immediately, then best-effort server token revocation.
        */

        const refreshToken = tokenStorage.get();

        dispatch(clearCredentials());
        tokenStorage.clear();

        if (refreshToken) {
          await baseQuery({
            url: "/auth/signout",
            method: "POST",
            body: { refreshToken },
          });
        }

        return { data: { message: "Signed out successfully!" } };
      },
    }),

    // ── POST /api/auth/forgot-password ─────────────────────────────────────────────────────
    forgotPassword: builder.mutation<ApiSuccessResponse<ForgotPasswordResponse>, ForgotPasswordRequest>({
      query: body => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // ── POST /api/auth/reset-password ─────────────────────────────────────────────────────
    resetPassword: builder.mutation<ApiSuccessResponse<MessageResponse>, ResetPasswordRequest>({
      query: body => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // ── POST /api/auth/verify-email ─────────────────────────────────────────────────────
    verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
      query: body => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    // ── POST /api/auth/send-verification ─────────────────────────────────────────────────────
    sendVerification: builder.mutation<SendVerificationResponse, SendVerificationRequest>({
      query: body => ({
        url: "/auth/send-verification",
        method: "POST",
        body,
      }),
    }),

    // ── GET /api/auth/me ─────────────────────────────────────────────────────
    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
    }),

    // ── GET /api/auth/verification-status ─────────────────────────────────────────────────────
    verificationStatus: builder.query<VerificationStatusResponse, void>({
      query: () => "/auth/verification-status",
    }),

  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationMutation,
  useVerifyEmailMutation,
  useGetMeQuery,
  useVerificationStatusQuery,
} = authApi;
