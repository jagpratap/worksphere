import { useCallback } from "react";

import type { Permission } from "@/config/permissions";

import { selectCurrentUserRole } from "@/features/auth";
import { useAppSelector } from "@/store";
import {
  canAccess,
  hasAllPermissions,
  hasAnyPermission,
} from "@/utils/permissions";

/**
 * Binds the permissions engine to the current user's role from Redux.
 *
 * @example
 * const { can, canAny } = usePermission();
 * if (can(PERMISSIONS.PROJECTS_LIST)) { ... }
 */

export function usePermission() {
  const role = useAppSelector(selectCurrentUserRole);

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!role)
        return false;
      return canAccess(role, permission);
    },
    [role],
  );

  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!role)
        return false;
      return hasAnyPermission(role, permissions);
    },
    [role],
  );

  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      if (!role)
        return false;
      return hasAllPermissions(role, permissions);
    },
    [role],
  );

  return {
    can,
    canAny,
    canAll,
  } as const;
}
