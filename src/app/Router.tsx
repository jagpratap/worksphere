import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import { ErrorFallback } from "@/components/common/ErrorFallback";
import { FullPageSpinner } from "@/components/common/FullPageSpinner";
import { paths } from "@/config/paths";

import { AuthGuard, GuestGuard } from "./guards";
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
                  children: [],
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
              children: [],
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
