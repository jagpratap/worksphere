import {
  Activity,
  FolderKanban,
  ListChecks,
  Shield,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Users", value: "12", icon: Users, change: "+2 this month" },
  { label: "Active Projects", value: "4", icon: FolderKanban, change: "2 in progress" },
  { label: "Total Tasks", value: "19", icon: ListChecks, change: "6 completed" },
  { label: "Audit Events", value: "—", icon: Shield, change: "Coming soon" },
];

const recentActivity = [
  { action: "Alice Admin created project Mobile App", time: "2 hours ago" },
  { action: "Bob Manager added sprint Sprint 2 to WorkSphere Platform", time: "4 hours ago" },
  { action: "Carol Member logged 2h 30m on API Integration", time: "Yesterday" },
  { action: "Diana Prince updated task WSP-004 status to Done", time: "Yesterday" },
  { action: "Frank Castle was assigned to MOB-002", time: "2 days ago" },
];

export default function AdminDashboardRoute() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="System overview and platform health"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Activity className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <QuickActionRow icon={Users} label="Manage Users" status="Coming Soon" />
              <QuickActionRow icon={Shield} label="View Audit Log" status="Coming Soon" />
              <QuickActionRow icon={FolderKanban} label="All Projects" status="Available" active />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function QuickActionRow({ icon: Icon, label, status, active }: {
  icon: typeof Users;
  label: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-xs ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
        {status}
      </span>
    </div>
  );
}
