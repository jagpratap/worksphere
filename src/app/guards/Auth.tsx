import { Navigate, Outlet, useLocation } from "react-router";

import { FullPageSpinner } from "@/components/common/FullPageSpinner";
import { paths } from "@/config/paths";
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/features/auth";
import { useAppSelector } from "@/store";

export function AuthGuard() {
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isInitialized) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={paths.auth.signin.getHref(location.pathname)}
        replace
      />
    );
  }

  return <Outlet />;
}
