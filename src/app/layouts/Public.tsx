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

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

// Uses `document.getElementById` instead of React refs because the target
// sections live in a child route component (Landing.tsx) rendered via <Outlet>.
// Refs would require a shared context or store to bridge the layout ↔ route
// boundary — unnecessary complexity for same-page scroll navigation.
function scrollToSection(hash: string) {
  document
    .getElementById(hash.replace("#", ""))
    ?.scrollIntoView({ behavior: "smooth" });
}

export function PublicLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");
  const isLanding = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-50 flex items-center justify-between h-header border-b border-border/50 bg-background/80 px-page-x backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link to={paths.home.path} className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
              <Orbit className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-base font-bold tracking-tight">
              Work
              <span className="text-primary">Sphere</span>
            </span>
          </Link>

          {isLanding && (
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
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
