import { Link } from "react-router";

import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { selectCurrentUserRole } from "@/features/auth";
import { useAppSelector } from "@/store";

export default function UnauthorizedRoute() {
  const role = useAppSelector(selectCurrentUserRole);
  const homePath = role ? ROLE_HOME_ROUTE[role] : paths.home.path;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-group p-page-x">
      <h1 className="text-6xl font-bold text-muted-foreground">403</h1>
      <p className="text-lg text-muted-foreground">
        You don't have access to this page
      </p>
      <Link
        to={homePath}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
