// ─── Input Types ────────────────────────────────────────────────────────────

export type CreateTimeEntryInput = {
  taskId: string;
  minutes: number;
  date: string;
  description?: string;
};

export type UpdateTimeEntryInput = Partial<CreateTimeEntryInput>;

// ─── Response Types ─────────────────────────────────────────────────────────

export type TimeEntryWithTask = {
  id: string;
  taskId: string;
  userId: string;
  projectId: string;
  minutes: number;
  description: string;
  date: string;
  taskKey: string | null;
  taskTitle: string | null;
  createdAt: string;
  updatedAt: string;
};
