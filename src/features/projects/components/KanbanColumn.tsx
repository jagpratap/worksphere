import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { TaskStatus } from "@/constants";
import type { SafeUser, Task } from "@/types";

import {
  TASK_STATUS_COLUMN_COLORS,
  TASK_STATUS_LABELS,
} from "@/constants";
import { cn } from "@/lib/utils";

import { TaskCard } from "./TaskCard";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  members: SafeUser[];
  onTaskClick?: (task: Task) => void;
};

export function KanbanColumn({ status, tasks, members, onTaskClick }: KanbanColumnProps) {
  const memberMap = new Map(members.map(m => [m.id, m]));
  const taskIds = tasks.map(t => t.id);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  });

  return (
    <div className="flex min-w-[272px] flex-1 flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 pb-3">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: TASK_STATUS_COLUMN_COLORS[status] }}
        />
        <span className="text-sm font-medium">
          {TASK_STATUS_LABELS[status]}
        </span>
        <span className="text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Droppable task list */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            "flex min-h-[96px] flex-col gap-2 rounded-lg p-1 transition-colors",
            isOver && "bg-muted/50",
          )}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={task.assigneeId ? memberMap.get(task.assigneeId) : null}
              onClick={() => onTaskClick?.(task)}
            />
          ))}

          {tasks.length === 0 && !isOver && (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
