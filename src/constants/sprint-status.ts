import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

// ─── Sprint Status ─────────────────────────────────────────────────────────

export const SPRINT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type SprintStatus = (typeof SPRINT_STATUS)[keyof typeof SPRINT_STATUS];

export const SPRINT_STATUS_LABELS: Record<SprintStatus, string> = {
  [SPRINT_STATUS.PLANNING]: "Planning",
  [SPRINT_STATUS.ACTIVE]: "Active",
  [SPRINT_STATUS.COMPLETED]: "Completed",
};

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export const SPRINT_STATUS_BADGE_VARIANTS: Record<SprintStatus, BadgeVariant> = {
  [SPRINT_STATUS.PLANNING]: "outline",
  [SPRINT_STATUS.ACTIVE]: "default",
  [SPRINT_STATUS.COMPLETED]: "secondary",
};

export const DEFAULT_SPRINT_STATUS = SPRINT_STATUS.PLANNING;
