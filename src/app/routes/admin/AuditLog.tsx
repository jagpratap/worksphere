import { Shield } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

export default function AuditLogRoute() {
  return (
    <>
      <PageHeader title="Audit Log" description="Track system events and user actions" />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="mb-4 size-10 text-muted-foreground/50" />
          <h2 className="mb-1 text-lg font-medium">Coming Soon</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Comprehensive audit logging with filters, search, export, and compliance reporting will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
