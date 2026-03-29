import { Loader2 } from "lucide-react";

import { PageContainer } from "./PageContainer";

export function FullPageSpinner() {
  return (
    <PageContainer className="flex-row">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-secondary-foreground">Loading WorkSphere...</p>
    </PageContainer>
  );
}
