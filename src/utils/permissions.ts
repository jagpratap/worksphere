import type { Permission } from "@/config/permissions";
import type { Role } from "@/constants";

import { ROLE_PERMISSIONS } from "@/config/permissions";

export function canAccess(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms)
    return false;
  return permissions.some(p => rolePerms.has(p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms)
    return false;
  return permissions.every(p => rolePerms.has(p));
}
