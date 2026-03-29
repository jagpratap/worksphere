import type { ProjectColor, ProjectStatus, Role, TaskPriority, TaskStatus, UserStatus } from "@/constants";

// ─── User ───────────────────────────────────────────────────────────────────
// Password-stripped user returned by the API.

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  lastActiveAt: string;
};

// ─── Project ────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  color: ProjectColor;
  ownerId: string;
  memberIds: string[];
  taskCount: number;
  createdAt: string;
  updatedAt: string;
};

// ─── Task ───────────────────────────────────────────────────────────────────

export type Task = {
  id: string;
  projectId: string;
  key: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
