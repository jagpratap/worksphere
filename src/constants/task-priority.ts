import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

// ─── Task Priority ──────────────────────────────────────────────────────────

export const TASK_PRIORITY = {
  URGENT: "urgent",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TASK_PRIORITY.URGENT]: "Urgent",
  [TASK_PRIORITY.HIGH]: "High",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.LOW]: "Low",
};

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export const TASK_PRIORITY_BADGE_VARIANTS: Record<TaskPriority, BadgeVariant> = {
  [TASK_PRIORITY.URGENT]: "destructive",
  [TASK_PRIORITY.HIGH]: "default",
  [TASK_PRIORITY.MEDIUM]: "secondary",
  [TASK_PRIORITY.LOW]: "outline",
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TASK_PRIORITY.URGENT]: "#ef4444",
  [TASK_PRIORITY.HIGH]: "#f97316",
  [TASK_PRIORITY.MEDIUM]: "#eab308",
  [TASK_PRIORITY.LOW]: "#6b7280",
};

export const TASK_PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  [TASK_PRIORITY.URGENT]: 4,
  [TASK_PRIORITY.HIGH]: 3,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.LOW]: 1,
};

export const DEFAULT_TASK_PRIORITY = TASK_PRIORITY.MEDIUM;
