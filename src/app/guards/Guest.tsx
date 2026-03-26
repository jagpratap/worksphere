import { Navigate, Outlet, useSearchParams } from "react-router";

import { FullPageSpinner } from "@/components/common/FullPageSpinner";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import {
  selectCurrentUserRole,
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/features/auth";
import { useAppSelector } from "@/store";

export function GuestGuard() {
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);

  const [searchParams] = useSearchParams();

  if (!isInitialized) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated && role) {
    const redirectTo = searchParams.get("redirectTo") ?? ROLE_HOME_ROUTE[role];
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
