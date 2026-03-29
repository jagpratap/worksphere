import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TASK_STATUS_COLUMN_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/constants";
import { getInitials } from "@/utils/string";

import type { MemberWorkload } from "../types";

type MemberWorkloadCardProps = {
  workload: MemberWorkload;
};

export function MemberWorkloadCard({ workload }: MemberWorkloadCardProps) {
  const { user, tasksByStatus, totalTasks } = workload;

  return (
    <Card className="gap-4 p-4">
      {/* User header */}
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {totalTasks}
            {" "}
            {totalTasks === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="space-y-2">
        {TASK_STATUS_ORDER.map((status) => {
          const count = tasksByStatus[status] ?? 0;
          if (count === 0)
            return null;
          return (
            <div key={status} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: TASK_STATUS_COLUMN_COLORS[status] }}
                />
                <span className="text-muted-foreground">
                  {TASK_STATUS_LABELS[status]}
                </span>
              </div>
              <span className="font-medium tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="flex h-2 overflow-hidden rounded-full">
          {TASK_STATUS_ORDER.map((status) => {
            const count = tasksByStatus[status] ?? 0;
            if (count === 0)
              return null;
            const pct = (count / totalTasks) * 100;
            return (
              <div
                key={status}
                className="h-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: TASK_STATUS_COLUMN_COLORS[status],
                }}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
}

export function MemberWorkloadCardSkeleton() {
  return (
    <Card className="gap-4 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-6" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </Card>
  );
}
