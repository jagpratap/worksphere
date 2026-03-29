import type { TaskPriority, TaskStatus } from "@/constants";

// ─── Input Types ────────────────────────────────────────────────────────────

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  sprintId?: string | null;
};

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "projectId">>;

export type ReorderTaskInput = {
  id: string;
  status: TaskStatus;
  order: number;
};

// ─── Request/Response Types ─────────────────────────────────────────────────

export type ReorderTasksRequest = {
  updates: ReorderTaskInput[];
};

export type ReorderTasksResponse = {
  updated: number;
};
