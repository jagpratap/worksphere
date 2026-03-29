import type {
  ProjectColor,
  ProjectStatus,
  Role,
  SprintStatus,
  TaskPriority,
  TaskStatus,
  UserStatus,
} from "@/constants";

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
  sprintId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// ─── Sprint ────────────────────────────────────────────────────────────────

export type Sprint = {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

// ─── Time Entry ────────────────────────────────────────────────────────────

export type TimeEntry = {
  id: string;
  taskId: string;
  userId: string;
  projectId: string;
  minutes: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};
