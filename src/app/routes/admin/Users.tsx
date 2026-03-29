import { Users } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersRoute() {
  return (
    <>
      <PageHeader title="Users" description="Manage platform users and roles" />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 size-10 text-muted-foreground/50" />
          <h2 className="mb-1 text-lg font-medium">Coming Soon</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            User management with role assignment, account status toggling, invitations, and bulk operations will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
