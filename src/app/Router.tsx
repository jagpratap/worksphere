import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import { ErrorFallback, FullPageSpinner } from "@/components/common";
import { paths } from "@/config/paths";

import { AuthGuard, GuestGuard, RoleGuard } from "./guards";
import { AuthLayout, ProtectedLayout, PublicLayout, RootLayout } from "./layouts";
import { rootLoader } from "./loader";

type RouteModule = { default: React.ComponentType };

function lazyRoute(importFn: () => Promise<RouteModule>) {
  return () => importFn().then(m => ({ Component: m.default }));
}

export function Router() {
  const router = useMemo(() => createBrowserRouter([
    {
      element: <RootLayout />,
      loader: rootLoader,
      errorElement: <ErrorFallback />,
      HydrateFallback: FullPageSpinner,
      children: [
        {
          element: <PublicLayout />,
          children: [
            {
              path: paths.home.path,
              lazy: lazyRoute(() => import("./routes/Landing")),
            },
            {
              path: paths.unauthorized.path,
              lazy: lazyRoute(() => import("./routes/Unauthorized")),
            },

            // ── Auth (guest only) ─────────────────────────────────────────────
            {
              element: <GuestGuard />,
              children: [
                {
                  element: <AuthLayout />,
                  children: [
                    {
                      path: paths.auth.signin.path,
                      lazy: lazyRoute(() => import("./routes/auth/SignIn")),
                    },
                    {
                      path: paths.auth.signup.path,
                      lazy: lazyRoute(() => import("./routes/auth/SignUp")),
                    },
                    {
                      path: paths.auth.forgotPassword.path,
                      lazy: lazyRoute(() => import("./routes/auth/ForgotPassword")),
                    },
                    {
                      path: paths.auth.resetPassword.path,
                      lazy: lazyRoute(() => import("./routes/auth/ResetPassword")),
                    },
                  ],
                },
              ],
            },

          ],
        },

        // ── Protected (authenticated) ──────────────────────────────────────────
        {
          element: <AuthGuard />,
          children: [
            {
              element: <ProtectedLayout />,
              children: [
                // ── Admin ── /admin/* ─────────────────────────────────────
                {
                  element: <RoleGuard />,
                  children: [
                    {
                      path: paths.admin.root.path,
                      lazy: lazyRoute(() => import("./routes/admin/Dashboard")),
                    },
                  ],
                },

                // ── App (Manager) ── /app/* ─────────────────────────────────
                {
                  element: <RoleGuard />,
                  children: [
                    {
                      path: paths.app.root.path,
                      lazy: lazyRoute(() => import("./routes/app/Dashboard")),
                    },
                    {
                      path: paths.app.projects.root.path,
                      lazy: lazyRoute(() => import("./routes/app/Projects")),
                    },
                    {
                      path: paths.app.projects.detail().path,
                      lazy: lazyRoute(() => import("./routes/app/ProjectDetail")),
                    },
                    {
                      path: paths.app.workload.path,
                      lazy: lazyRoute(() => import("./routes/app/Workload")),
                    },
                  ],
                },

                // ── My (Member) ── /my/* ──────────────────────────────────
                {
                  element: <RoleGuard />,
                  children: [
                    {
                      path: paths.my.tasks.root.path,
                      lazy: lazyRoute(() => import("./routes/my/Tasks")),
                    },
                    {
                      path: paths.my.timeTracker.path,
                      lazy: lazyRoute(() => import("./routes/my/Time")),
                    },
                  ],
                },

                // ── Shared (Admin, Manager, Member) ── /shared/* ─────────────
                {
                  element: <RoleGuard />,
                  children: [
                    {
                      path: paths.shared.profile.path,
                      lazy: lazyRoute(() => import("./routes/shared/Profile")),
                    },
                    {
                      path: paths.shared.settings.path,
                      lazy: lazyRoute(() => import("./routes/shared/Settings")),
                    },
                    {
                      path: paths.shared.notifications.path,
                      lazy: lazyRoute(() => import("./routes/shared/Notifications")),
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Catch-all ─────────────────────────────────────────────────────
        {
          path: "*",
          lazy: lazyRoute(() => import("./routes/NotFound")),
        },
      ],
    },
  ]), []);
  return <RouterProvider router={router} />;
}
