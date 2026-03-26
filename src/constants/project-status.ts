import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

// ─── Project Status ─────────────────────────────────────────────────────────

export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [PROJECT_STATUS.PLANNING]: "Planning",
  [PROJECT_STATUS.ACTIVE]: "Active",
  [PROJECT_STATUS.COMPLETED]: "Completed",
  [PROJECT_STATUS.ARCHIVED]: "Archived",
};

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export const PROJECT_STATUS_BADGE_VARIANTS: Record<ProjectStatus, BadgeVariant> = {
  [PROJECT_STATUS.PLANNING]: "outline",
  [PROJECT_STATUS.ACTIVE]: "default",
  [PROJECT_STATUS.COMPLETED]: "secondary",
  [PROJECT_STATUS.ARCHIVED]: "secondary",
};

export const DEFAULT_PROJECT_STATUS = PROJECT_STATUS.PLANNING;

// ─── Project Colors ─────────────────────────────────────────────────────────

export const PROJECT_COLORS = {
  BLUE: "blue",
  GREEN: "green",
  PURPLE: "purple",
  ORANGE: "orange",
  RED: "red",
  TEAL: "teal",
  PINK: "pink",
  YELLOW: "yellow",
} as const;

export type ProjectColor = (typeof PROJECT_COLORS)[keyof typeof PROJECT_COLORS];

export const PROJECT_COLOR_VALUES: Record<ProjectColor, string> = {
  [PROJECT_COLORS.BLUE]: "#3b82f6",
  [PROJECT_COLORS.GREEN]: "#22c55e",
  [PROJECT_COLORS.PURPLE]: "#a855f7",
  [PROJECT_COLORS.ORANGE]: "#f97316",
  [PROJECT_COLORS.RED]: "#ef4444",
  [PROJECT_COLORS.TEAL]: "#14b8a6",
  [PROJECT_COLORS.PINK]: "#ec4899",
  [PROJECT_COLORS.YELLOW]: "#eab308",
};

export const PROJECT_COLOR_LABELS: Record<ProjectColor, string> = {
  [PROJECT_COLORS.BLUE]: "Blue",
  [PROJECT_COLORS.GREEN]: "Green",
  [PROJECT_COLORS.PURPLE]: "Purple",
  [PROJECT_COLORS.ORANGE]: "Orange",
  [PROJECT_COLORS.RED]: "Red",
  [PROJECT_COLORS.TEAL]: "Teal",
  [PROJECT_COLORS.PINK]: "Pink",
  [PROJECT_COLORS.YELLOW]: "Yellow",
};

export const DEFAULT_PROJECT_COLOR = PROJECT_COLORS.BLUE;
