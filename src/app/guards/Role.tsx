import { Navigate, Outlet, useLocation } from "react-router";

import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole } from "@/features/auth";
import { useAppSelector } from "@/store";
import { getAllowedRolesForPath } from "@/utils/roles";

export function RoleGuard() {
  const role = useAppSelector(selectCurrentUserRole);
  const location = useLocation();

  const allowedRoles = getAllowedRolesForPath(location.pathname);

  if (!allowedRoles) {
    return <Outlet />;
  }

  if (!role || !allowedRoles.includes(role)) {
    const redirectTo = role ? ROLE_HOME_ROUTE[role] : "/auth/signin";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
