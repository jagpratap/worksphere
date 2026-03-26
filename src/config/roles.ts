import type { Role } from "@/constants";

import { ROLES } from "@/constants";

export const DEFAULT_ROLE: Role = ROLES.MEMBER;

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.MANAGER]: "/app",
  [ROLES.MEMBER]: "/my/tasks",
};

export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/admin": [ROLES.ADMIN],
  "/app": [ROLES.ADMIN, ROLES.MANAGER],
  "/my": [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
  "/shared": [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
};
