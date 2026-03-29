import type { Task } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TASK_PRIORITY_BADGE_VARIANTS,
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_COLUMN_COLORS,
  TASK_STATUS_LABELS,
} from "@/constants";
import { formatDate } from "@/utils/date";

export function MyTaskCard({ task }: { task: Task }) {
  return (
    <Card className="gap-2 p-4">
      {/* Top: Key + Title */}
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: TASK_STATUS_COLUMN_COLORS[task.status] }}
        />
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {task.key}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {task.title}
        </span>
      </div>

      {/* Bottom: Status + Priority + Date */}
      <div className="flex items-center gap-3 pl-[18px]">
        <span className="text-xs text-muted-foreground">
          {TASK_STATUS_LABELS[task.status]}
        </span>
        <Badge variant={TASK_PRIORITY_BADGE_VARIANTS[task.priority]} className="gap-1">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: TASK_PRIORITY_COLORS[task.priority] }}
          />
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDate(task.updatedAt)}
        </span>
      </div>
    </Card>
  );
}

export function MyTaskCardSkeleton() {
  return (
    <Card className="gap-2 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="size-2.5 rounded-full" />
        <Skeleton className="h-3.5 w-14" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-2 pl-[18px]">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="ml-auto h-3 w-20" />
      </div>
    </Card>
  );
}
