import { ArrowRight, Orbit } from "lucide-react";
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
        <div className="flex items-center gap-6">
          <Link to={paths.home.path} className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
              <Orbit className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-base font-bold tracking-tight">
              Work
              <span className="text-primary">Sphere</span>
            </span>
          </Link>
        </div>
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
