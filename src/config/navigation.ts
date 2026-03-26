import type { LucideIcon } from "lucide-react";

import {
  Bell,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

import type { Permission } from "./permissions";

import { paths } from "./paths";
import { PERMISSIONS } from "./permissions";

// ─── Types ──────────────────────────────────────────────────────────────────

export type NavItem = {
  title: string;
  path: string;
  icon: LucideIcon;
  permission: Permission;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// ─── Navigation Groups ──────────────────────────────────────────────────────

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Administration",
    items: [
      {
        title: "Admin Dashboard",
        path: paths.admin.root.path,
        icon: ShieldCheck,
        permission: PERMISSIONS.DASHBOARD_ADMIN,
      },
      {
        title: "Users",
        path: paths.admin.users.path,
        icon: Users,
        permission: PERMISSIONS.USERS_MANAGE,
      },
      {
        title: "Billing",
        path: paths.admin.billing.path,
        icon: Receipt,
        permission: PERMISSIONS.BILLING_MANAGE,
      },
      {
        title: "Audit Log",
        path: paths.admin.auditLog.path,
        icon: Shield,
        permission: PERMISSIONS.AUDIT_VIEW,
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        path: paths.app.root.path,
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_MANAGER,
      },
      {
        title: "Projects",
        path: paths.app.projects.root.path,
        icon: FolderKanban,
        permission: PERMISSIONS.PROJECTS_LIST,
      },
      {
        title: "Workload",
        path: paths.app.workload.path,
        icon: Waypoints,
        permission: PERMISSIONS.WORKLOAD_VIEW,
      },
    ],
  },
  {
    label: "My Work",
    items: [
      {
        title: "My Tasks",
        path: paths.my.tasks.root.path,
        icon: ListChecks,
        permission: PERMISSIONS.TASKS_LIST,
      },
      {
        title: "Time Tracker",
        path: paths.my.timeTracker.path,
        icon: Clock,
        permission: PERMISSIONS.TIME_OWN,
      },
    ],
  },
  {
    label: "General",
    items: [
      {
        title: "Notifications",
        path: paths.shared.notifications.path,
        icon: Bell,
        permission: PERMISSIONS.NOTIFICATIONS_OWN,
      },
      {
        title: "Settings",
        path: paths.shared.settings.path,
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_OWN,
      },
    ],
  },
];
