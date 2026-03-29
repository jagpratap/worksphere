import type { Role } from "@/constants";

import { ROLES } from "@/constants";

// ─── Permission Keys ────────────────────────────────────────────────────────
// Format: "resource.action"

export const PERMISSIONS = {
  // ── Dashboards ────────────────────────────────────────────────────────────
  DASHBOARD_ADMIN: "dashboard.admin",
  DASHBOARD_MANAGER: "dashboard.manager",
  DASHBOARD_MEMBER: "dashboard.member",

  // ── Sidebar sections ─────────────────────────────────────────────────────
  USERS_MANAGE: "users.manage",
  BILLING_MANAGE: "billing.manage",
  AUDIT_VIEW: "audit.view",
  PROJECTS_LIST: "projects.list",
  PROJECTS_CREATE: "projects.create",
  BOARD_VIEW: "board.view",
  SPRINTS_MANAGE: "sprints.manage",
  WORKLOAD_VIEW: "workload.view",
  TASKS_LIST: "tasks.list",
  TASKS_CREATE: "tasks.create",
  TIME_OWN: "time.own",

  // ── Shared routes ─────────────────────────────────────────────────────────
  NOTIFICATIONS_OWN: "notifications.own",
  SETTINGS_OWN: "settings.own",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Role → Permission Map ──────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  [ROLES.ADMIN]: new Set([
    PERMISSIONS.DASHBOARD_ADMIN,
    PERMISSIONS.DASHBOARD_MANAGER,
    PERMISSIONS.DASHBOARD_MEMBER,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.PROJECTS_LIST,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.BOARD_VIEW,
    PERMISSIONS.SPRINTS_MANAGE,
    PERMISSIONS.WORKLOAD_VIEW,
    PERMISSIONS.TASKS_LIST,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TIME_OWN,
    PERMISSIONS.NOTIFICATIONS_OWN,
    PERMISSIONS.SETTINGS_OWN,
  ]),

  [ROLES.MANAGER]: new Set([
    PERMISSIONS.DASHBOARD_MANAGER,
    PERMISSIONS.DASHBOARD_MEMBER,
    PERMISSIONS.PROJECTS_LIST,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.BOARD_VIEW,
    PERMISSIONS.SPRINTS_MANAGE,
    PERMISSIONS.WORKLOAD_VIEW,
    PERMISSIONS.TASKS_LIST,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TIME_OWN,
    PERMISSIONS.NOTIFICATIONS_OWN,
    PERMISSIONS.SETTINGS_OWN,
  ]),

  [ROLES.MEMBER]: new Set([
    PERMISSIONS.DASHBOARD_MEMBER,
    PERMISSIONS.TASKS_LIST,
    PERMISSIONS.TIME_OWN,
    PERMISSIONS.NOTIFICATIONS_OWN,
    PERMISSIONS.SETTINGS_OWN,
  ]),
};
