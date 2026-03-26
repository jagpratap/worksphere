import { Loader2 } from "lucide-react";

export function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-secondary-foreground">Loading WorkSphere...</p>
    </div>
  );
}
