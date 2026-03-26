import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole, selectIsAuthenticated } from "@/features/auth";
import { useAppSelector } from "@/store";

export default function LandingRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-group p-page-x text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Manage projects,
        <br />
        not chaos.
      </h1>
      <p className="max-w-md text-muted-foreground">
        A lightweight project management tool for teams that want clarity
        without the complexity.
      </p>

      {isAuthenticated && role
        ? (
            <Button size="lg" asChild>
              <Link to={ROLE_HOME_ROUTE[role]}>
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )
        : (
            <div className="flex gap-3">
              <Button size="lg" asChild>
                <Link to={paths.auth.signup.path}>Get started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={paths.auth.signin.path}>Sign in</Link>
              </Button>
            </div>
          )}
    </main>
  );
}
