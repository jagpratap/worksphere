import { isRouteErrorResponse, Link, useRouteError } from "react-router";

import { paths } from "@/config/paths";

/**
 * Route error boundary — used as `errorElement` in the router.
 * Handles both thrown Response errors and unexpected JS errors.
 */
export function ErrorFallback() {
  const error = useRouteError();

  let status = 500;
  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || message;
  }
  else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-group p-page-x">
      <h1 className="text-6xl font-bold text-muted-foreground">{status}</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
      <Link
        to={paths.home.path}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
