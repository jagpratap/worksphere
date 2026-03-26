export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.MEMBER]: "Member",
};
