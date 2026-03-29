import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  TASK_STATUS_COLUMN_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from "@/constants";
import { getInitials } from "@/utils/string";

import type { ProjectDetailResponse } from "../types";

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

        <div className="space-y-2">
          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
              <AvatarFallback className="text-xs">
                {getInitials(project.owner.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <span className="text-sm">{project.owner.name}</span>
            </div>
            <Badge variant="outline" className="text-[10px]">Owner</Badge>
          </div>

          {/* Members */}
          {project.members.map(member => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar className="size-7">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">{member.name}</span>
            </div>
          ))}

          {project.members.length === 0 && (
            <p className="text-xs text-muted-foreground">No members assigned</p>
          )}
        </div>
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
