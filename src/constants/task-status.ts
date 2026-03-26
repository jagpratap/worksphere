import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

// ─── Task Status ────────────────────────────────────────────────────────────

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.IN_REVIEW]: "In Review",
  [TASK_STATUS.DONE]: "Done",
};

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export const TASK_STATUS_BADGE_VARIANTS: Record<TaskStatus, BadgeVariant> = {
  [TASK_STATUS.TODO]: "outline",
  [TASK_STATUS.IN_PROGRESS]: "default",
  [TASK_STATUS.IN_REVIEW]: "secondary",
  [TASK_STATUS.DONE]: "secondary",
};

export const TASK_STATUS_COLUMN_COLORS: Record<TaskStatus, string> = {
  [TASK_STATUS.TODO]: "#6b7280",
  [TASK_STATUS.IN_PROGRESS]: "#3b82f6",
  [TASK_STATUS.IN_REVIEW]: "#a855f7",
  [TASK_STATUS.DONE]: "#22c55e",
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.DONE,
];

export const DEFAULT_TASK_STATUS = TASK_STATUS.TODO;
