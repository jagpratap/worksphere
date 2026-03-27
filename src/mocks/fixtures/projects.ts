import type { Project } from "@/types";

import { PROJECT_COLORS, PROJECT_STATUS } from "@/constants";

// taskCount is computed at response time — not stored in fixtures.
export type MockProject = Omit<Project, "taskCount">;

export const FIXTURE_PROJECTS: MockProject[] = [
  {
    id: "proj_001",
    name: "WorkSphere",
    key: "WSP",
    description: "Internal project management platform for teams.",
    status: PROJECT_STATUS.ACTIVE,
    color: PROJECT_COLORS.BLUE,
    ownerId: "usr_002", // Bob
    memberIds: ["usr_005", "usr_006", "usr_007"], // Carol, Frank, Grace
    createdAt: "2024-06-01T00:00:00.000Z",
    updatedAt: "2025-03-10T09:00:00.000Z",
  },
  {
    id: "proj_002",
    name: "Mobile App",
    key: "MOB",
    description: "Cross-platform mobile companion for WorkSphere.",
    status: PROJECT_STATUS.ACTIVE,
    color: PROJECT_COLORS.GREEN,
    ownerId: "usr_003", // Diana
    memberIds: ["usr_006", "usr_009", "usr_010"], // Frank, Isla, James
    createdAt: "2024-07-15T00:00:00.000Z",
    updatedAt: "2025-03-08T14:30:00.000Z",
  },
  {
    id: "proj_003",
    name: "Design System",
    key: "DSN",
    description: "Shared component library and design tokens.",
    status: PROJECT_STATUS.PLANNING,
    color: PROJECT_COLORS.PURPLE,
    ownerId: "usr_002", // Bob
    memberIds: ["usr_007", "usr_012"], // Grace, Leo
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-03-12T11:00:00.000Z",
  },
  {
    id: "proj_004",
    name: "API Gateway",
    key: "AGW",
    description: "Centralized API gateway with rate limiting and auth.",
    status: PROJECT_STATUS.ACTIVE,
    color: PROJECT_COLORS.ORANGE,
    ownerId: "usr_003", // Diana
    memberIds: ["usr_005", "usr_010", "usr_011"], // Carol, James, Karen
    createdAt: "2024-09-20T00:00:00.000Z",
    updatedAt: "2025-03-14T16:00:00.000Z",
  },
  {
    id: "proj_005",
    name: "Marketing Site",
    key: "MKT",
    description: "Public-facing marketing website and blog.",
    status: PROJECT_STATUS.ARCHIVED,
    color: PROJECT_COLORS.TEAL,
    ownerId: "usr_002", // Bob
    memberIds: ["usr_009"], // Isla
    createdAt: "2024-04-01T00:00:00.000Z",
    updatedAt: "2025-02-01T10:00:00.000Z",
  },
];
