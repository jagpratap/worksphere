import type { Project, SafeUser, Task } from "@/types";

export type ProjectWithOwner = Project & {
  owner: SafeUser | null;
};

export type ProjectDetailResponse = Project & {
  owner: SafeUser;
  members: SafeUser[];
  tasks: Task[];
};

// ─── Input Types ────────────────────────────────────────────────────────────

export type CreateProjectInput = Pick<Project, "name" | "key" | "description" | "status" | "color"> & {
  memberIds?: string[];
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
