import type { ReactNode } from "react";

import type { Permission } from "@/config/permissions";

import { usePermission } from "@/hooks/use-permission";

type PermissionGateProps = {
  requires: Permission | Permission[];
  match?: "any" | "all";
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * Declarative permission gate for JSX trees.
 *
 * Renders `children` only when the current user's role satisfies the
 * required permission(s). Renders `fallback` (default `null`) otherwise.
 *
 * Prefer this over `{can(PERM) && <X />}` when the check is purely
 * show/hide. Use the `usePermission` hook directly for conditional
 * logic, computed values, or non-JSX decisions.
 *
 * @example
 * // Single permission — hide if denied
 * <PermissionGate requires={PERMISSIONS.PROJECTS_CREATE}>
 *   <Button>New Project</Button>
 * </PermissionGate>
 *
 * @example
 * // Multiple permissions — show if user has at least one
 * <PermissionGate requires={[PERMISSIONS.TASKS_EDIT, PERMISSIONS.TASKS_EDIT_STATUS]}>
 *   <EditToolbar />
 * </PermissionGate>
 *
 * @example
 * // All required + fallback for read-only view
 * <PermissionGate
 *   requires={[PERMISSIONS.TASKS_CREATE, PERMISSIONS.TASKS_ASSIGN]}
 *   match="all"
 *   fallback={<StatusBadge status={task.status} />}
 * >
 *   <StatusSelect value={task.status} onChange={handleChange} />
 * </PermissionGate>
 */

export function PermissionGate({
  requires,
  match = "any",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can, canAny, canAll } = usePermission();

  const permissions = Array.isArray(requires) ? requires : [requires];

  const hasAccess
    = permissions.length === 1
      ? can(permissions[0])
      : match === "all"
        ? canAll(permissions)
        : canAny(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
