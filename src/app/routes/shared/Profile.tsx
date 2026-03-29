import { User } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileRoute() {
  return (
    <>
      <PageHeader title="Profile" description="Manage your account details" />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <User className="mb-4 size-10 text-muted-foreground/50" />
          <h2 className="mb-1 text-lg font-medium">Coming Soon</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Profile editing, avatar uploads, password changes, and account management will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
