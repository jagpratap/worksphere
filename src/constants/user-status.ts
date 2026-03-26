export const USER_STATUS = {
  ACTIVE: "active",
  DEACTIVATED: "deactivated",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.DEACTIVATED]: "Deactivated",
};
