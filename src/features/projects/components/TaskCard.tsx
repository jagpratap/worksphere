import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { SafeUser, Task } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  TASK_PRIORITY_BADGE_VARIANTS,
  TASK_PRIORITY_LABELS,
} from "@/constants";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

type TaskCardProps = {
  task: Task;
  assignee?: SafeUser | null;
  onClick?: () => void;
};

export function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab gap-2 p-3 active:cursor-grabbing",
        isDragging && "z-50 opacity-50 shadow-lg",
      )}
      onClick={onClick}
    >
      {/* Key + Priority */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {task.key}
        </span>
        <Badge
          variant={TASK_PRIORITY_BADGE_VARIANTS[task.priority]}
          className="text-[10px] px-1.5 py-0"
        >
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {/* Assignee */}
      {assignee && (
        <div className="flex items-center gap-1.5 pt-1">
          <Avatar className="size-5">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback className="text-[10px]">
              {getInitials(assignee.name)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">
            {assignee.name}
          </span>
        </div>
      )}
    </Card>
  );
}
