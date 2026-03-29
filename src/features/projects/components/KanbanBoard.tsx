import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";

import type { TaskStatus } from "@/constants";
import type { SafeUser, Task } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  TASK_PRIORITY_BADGE_VARIANTS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_ORDER,
} from "@/constants";
import { useReorderTasksMutation } from "@/features/tasks";

import { KanbanColumn } from "./KanbanColumn";

type KanbanBoardProps = {
  tasks: Task[];
  members: SafeUser[];
  onTaskClick?: (task: Task) => void;
};

export function KanbanBoard({ tasks, members, onTaskClick }: KanbanBoardProps) {
  const [reorderTasks] = useReorderTasksMutation();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);

  // Use local tasks during/after drag (optimistic), server tasks otherwise
  const currentTasks = localTasks ?? tasks;

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<TaskStatus, Task[]>();
    for (const status of TASK_STATUS_ORDER) {
      grouped.set(status, []);
    }
    for (const task of currentTasks) {
      grouped.get(task.status)?.push(task);
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [currentTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const findColumnForTask = useCallback((taskId: string): TaskStatus | null => {
    const task = currentTasks.find(t => t.id === taskId);
    return task?.status ?? null;
  }, [currentTasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = (event.active.data.current as { task: Task })?.task;
    if (task) {
      setActiveTask(task);
      setLocalTasks([...tasks]);
    }
  }, [tasks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !localTasks)
      return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine target column
    let targetStatus: TaskStatus | null = null;

    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as TaskStatus;
    }
    else {
      targetStatus = findColumnForTask(overId);
    }

    const sourceStatus = findColumnForTask(activeId);

    if (!targetStatus || !sourceStatus || targetStatus === sourceStatus)
      return;

    // Move task to new column
    setLocalTasks((prev) => {
      if (!prev)
        return prev;
      return prev.map(t =>
        t.id === activeId
          ? { ...t, status: targetStatus }
          : t,
      );
    });
  }, [localTasks, findColumnForTask]);

  const stopDrag = useCallback(() => {
    setActiveTask(null);
    setLocalTasks(null);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !localTasks) {
      stopDrag();
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine final target column
    let targetStatus: TaskStatus | null = null;

    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as TaskStatus;
    }
    else {
      targetStatus = localTasks.find(t => t.id === overId)?.status ?? null;
    }

    if (!targetStatus) {
      stopDrag();
      return;
    }

    // Build the final ordered list for the target column
    const movedTask = localTasks.find(t => t.id === activeId);
    if (!movedTask) {
      stopDrag();
      return;
    }

    // Get tasks in target column (excluding the dragged task)
    const columnTasks = localTasks
      .filter(t => t.status === targetStatus && t.id !== activeId)
      .sort((a, b) => a.order - b.order);

    // Find insertion index
    let insertIndex = columnTasks.length; // default: end
    if (!overId.startsWith("column-")) {
      const overIndex = columnTasks.findIndex(t => t.id === overId);
      if (overIndex !== -1) {
        insertIndex = overIndex;
      }
    }

    // Insert at position
    columnTasks.splice(insertIndex, 0, { ...movedTask, status: targetStatus });

    // Compute updates with new order
    const updates = columnTasks.map((t, index) => ({
      id: t.id,
      status: targetStatus,
      order: index,
    }));

    // Apply optimistic update — keep local state visible while mutation fires
    const optimisticTasks = localTasks.map((t) => {
      const update = updates.find(u => u.id === t.id);
      if (update) {
        return { ...t, status: update.status, order: update.order };
      }
      return t;
    });

    setActiveTask(null);
    setLocalTasks(optimisticTasks);

    // Fire mutation
    try {
      await reorderTasks({ updates }).unwrap();
    }
    catch {
      // Revert on failure
      setLocalTasks(null);
    }
  }, [localTasks, reorderTasks, stopDrag]);

  const handleDragCancel = useCallback(() => {
    stopDrag();
  }, [stopDrag]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUS_ORDER.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus.get(status) ?? []}
            members={members}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <Card className="w-[272px] gap-2 p-3 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {activeTask.key}
              </span>
              <Badge
                variant={TASK_PRIORITY_BADGE_VARIANTS[activeTask.priority]}
                className="text-[10px] px-1.5 py-0"
              >
                {TASK_PRIORITY_LABELS[activeTask.priority]}
              </Badge>
            </div>
            <p className="text-sm font-medium leading-snug">{activeTask.title}</p>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
