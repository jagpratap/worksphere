import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import {
  TASK_STATUS_COLUMN_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/constants";

import type { ProjectDetailResponse } from "../types";

import { MemberManager } from "./MemberManager";

type OverviewTabProps = {
  project: ProjectDetailResponse;
};

export function OverviewTab({ project }: OverviewTabProps) {
  const taskStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const status of TASK_STATUS_ORDER) {
      counts.set(status, 0);
    }
    for (const task of project.tasks) {
      counts.set(task.status, (counts.get(task.status) ?? 0) + 1);
    }
    return counts;
  }, [project.tasks]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Members */}
      <Card className="gap-3 p-4">
        <h3 className="text-sm font-medium">Members</h3>
        <MemberManager project={project} />
      </Card>

      {/* Task Stats */}
      <Card className="gap-3 p-4">
        <h3 className="text-sm font-medium">Tasks</h3>

        <div className="space-y-2">
          {TASK_STATUS_ORDER.map((status) => {
            const count = taskStats.get(status) ?? 0;
            return (
              <div key={status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: TASK_STATUS_COLUMN_COLORS[status],
                    }}
                  />
                  <span className="text-muted-foreground">
                    {TASK_STATUS_LABELS[status]}
                  </span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            );
          })}

          <div className="flex items-center justify-between border-t pt-2 text-sm">
            <span className="font-medium">Total</span>
            <span className="font-medium">{project.tasks.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
