import { ArrowRight } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

import type { Role } from "@/constants";

import { ThemeToggle } from "@/components/common";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import {
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "@/features/auth";
import { useAppSelector } from "@/store";

export function PublicLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex items-center justify-between h-header border-b border-border px-page-x">
        <Link to={paths.home.path} className="text-sm font-semibold tracking-tight">
          WorkSphere
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {navAction(isAuthenticated, role, isAuthPage)}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

function navAction(
  isAuthenticated: boolean,
  role: Role | null,
  isAuthPage: boolean,
) {
  if (isAuthenticated && role) {
    return (
      <Button size="sm" asChild>
        <Link to={ROLE_HOME_ROUTE[role]}>
          Dashboard
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    );
  }

  if (!isAuthPage) {
    return (
      <Button size="sm" variant="ghost" asChild>
        <Link to={paths.auth.signin.path}>Sign in</Link>
      </Button>
    );
  }

  return null;
}
