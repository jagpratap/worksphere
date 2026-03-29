import { Navigate, Outlet, useLocation } from "react-router";

import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole } from "@/features/auth";
import { useAppSelector } from "@/store";
import { getAllowedRolesForPath } from "@/utils/roles";

/**
 * Role-based route guard (runs after AuthGuard).
 * Looks up allowed roles for the current path via ROUTE_ROLE_MAP.
 * No mapping found → allows through (unrestricted route).
 * Wrong role → redirects to role's home; no role → sign in.
 */
export function RoleGuard() {
  const role = useAppSelector(selectCurrentUserRole);
  const location = useLocation();

  const allowedRoles = getAllowedRolesForPath(location.pathname);

  if (!allowedRoles) {
    return <Outlet />;
  }

  if (!role || !allowedRoles.includes(role)) {
    const redirectTo = role ? ROLE_HOME_ROUTE[role] : paths.auth.signin.path;
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
