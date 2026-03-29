import { CalendarDays, CheckCircle2, CircleDashed, Target, Zap } from "lucide-react";

import type { SprintStatus } from "@/constants";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SPRINT_STATUS,
  SPRINT_STATUS_BADGE_VARIANTS,
  SPRINT_STATUS_LABELS,
} from "@/constants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date";

import type { SprintWithStats } from "../types";

type SprintCardProps = {
  sprint: SprintWithStats;
  onClick: () => void;
};

const STATUS_ACCENT: Record<SprintStatus, string> = {
  [SPRINT_STATUS.PLANNING]: "border-l-muted-foreground/40",
  [SPRINT_STATUS.ACTIVE]: "border-l-primary",
  [SPRINT_STATUS.COMPLETED]: "border-l-emerald-500",
};

const PROGRESS_BAR_COLOR: Record<SprintStatus, string> = {
  [SPRINT_STATUS.PLANNING]: "bg-muted-foreground/40",
  [SPRINT_STATUS.ACTIVE]: "bg-primary",
  [SPRINT_STATUS.COMPLETED]: "bg-emerald-500",
};

const STATUS_ICON: Record<SprintStatus, typeof Zap> = {
  [SPRINT_STATUS.PLANNING]: CircleDashed,
  [SPRINT_STATUS.ACTIVE]: Zap,
  [SPRINT_STATUS.COMPLETED]: CheckCircle2,
};

export function SprintCard({ sprint, onClick }: SprintCardProps) {
  const progress = sprint.taskCount > 0
    ? Math.round((sprint.completedCount / sprint.taskCount) * 100)
    : 0;

  const StatusIcon = STATUS_ICON[sprint.status];

  return (
    <Card
      className={cn(
        "cursor-pointer border-l-[3px] gap-0 p-0 transition-all hover:bg-muted/40 hover:shadow-sm",
        STATUS_ACCENT[sprint.status],
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3 p-4 pb-3">
        {/* Header: Icon + Name + Badge */}
        <div className="flex items-center gap-2.5">
          <StatusIcon className="size-4 shrink-0 text-muted-foreground" />
          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">
            {sprint.name}
          </h3>
          <Badge variant={SPRINT_STATUS_BADGE_VARIANTS[sprint.status]} className="shrink-0">
            {SPRINT_STATUS_LABELS[sprint.status]}
          </Badge>
        </div>

        {/* Goal */}
        {sprint.goal && (
          <div className="flex items-start gap-2 pl-[26px]">
            <Target className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" />
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {sprint.goal}
            </p>
          </div>
        )}

        {/* Meta row: Date + Task count */}
        <div className="flex items-center gap-4 pl-[26px] text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3" />
            {formatDate(sprint.startDate)}
            {" — "}
            {formatDate(sprint.endDate)}
          </span>
          <span className="ml-auto tabular-nums">
            {sprint.completedCount}
            {" / "}
            {sprint.taskCount}
            {" tasks"}
          </span>
        </div>
      </div>

      {/* Progress bar — full-width bottom edge */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                PROGRESS_BAR_COLOR[sprint.status],
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground">
            {progress}
            %
          </span>
        </div>
      </div>
    </Card>
  );
}

export function SprintCardSkeleton() {
  return (
    <Card className="border-l-[3px] border-l-muted gap-0 p-0">
      <div className="flex flex-col gap-3 p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="ml-auto h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-start gap-2 pl-[26px]">
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center gap-4 pl-[26px]">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </Card>
  );
}
