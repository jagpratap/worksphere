import {
  Clock,
  FolderKanban,
  ListChecks,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { PageHeader } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "My Projects", value: "3", icon: FolderKanban, change: "1 active sprint" },
  { label: "Open Tasks", value: "13", icon: ListChecks, change: "4 high priority" },
  { label: "Team Members", value: "8", icon: Users, change: "Across all projects" },
  { label: "Hours This Week", value: "18.5", icon: Clock, change: "+3.5 vs last week" },
];

const activeWork = [
  { project: "WorkSphere Platform", sprint: "Sprint 2", tasks: 8, completed: 3 },
  { project: "Mobile App", sprint: "Sprint 1", tasks: 5, completed: 2 },
];

const topPriority = [
  { key: "WSP-001", title: "Dashboard analytics widget", priority: "Critical", status: "In Progress" },
  { key: "WSP-004", title: "API rate limiting middleware", priority: "High", status: "In Review" },
  { key: "MOB-002", title: "Push notification service", priority: "High", status: "To Do" },
];

export default function AppDashboardRoute() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Projects, sprints, and team overview"
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
        {/* Active Sprints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4 text-amber-500" />
              Active Sprints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeWork.map(item => (
                <div key={item.project} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.project}</p>
                      <p className="text-xs text-muted-foreground">{item.sprint}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.completed}
                      /
                      {item.tasks}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(item.completed / item.tasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-red-500" />
              Top Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPriority.map(task => (
                <div key={task.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{task.key}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        task.priority === "Critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                      }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm">{task.title}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{task.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
