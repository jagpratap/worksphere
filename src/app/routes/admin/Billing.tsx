import { Receipt } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

export default function BillingRoute() {
  return (
    <>
      <PageHeader title="Billing" description="Subscription and payment management" />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Receipt className="mb-4 size-10 text-muted-foreground/50" />
          <h2 className="mb-1 text-lg font-medium">Coming Soon</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Subscription plans, payment history, invoices, and billing settings will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
