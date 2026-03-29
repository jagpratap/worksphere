import type { SprintStatus } from "@/constants";

// ─── Input Types ────────────────────────────────────────────────────────────

export type CreateSprintInput = {
  projectId: string;
  name: string;
  goal?: string;
  status?: SprintStatus;
  startDate: string;
  endDate: string;
};

export type UpdateSprintInput = Partial<Omit<CreateSprintInput, "projectId">>;

// ─── Response Types ─────────────────────────────────────────────────────────

export type SprintWithStats = {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  taskCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
};
