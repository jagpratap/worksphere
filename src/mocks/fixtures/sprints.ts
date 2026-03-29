import type { Sprint } from "@/types";

import { SPRINT_STATUS } from "@/constants";

export type MockSprint = Sprint;

export const FIXTURE_SPRINTS: MockSprint[] = [
  // ── WSP — WorkSphere ─────────────────────────────────────────────────────
  {
    id: "sprint_001",
    projectId: "proj_001",
    name: "Sprint 1: Foundation",
    goal: "Set up project structure, design database schema, and implement authentication.",
    status: SPRINT_STATUS.COMPLETED,
    startDate: "2024-06-01",
    endDate: "2024-06-14",
    createdAt: "2024-05-28T09:00:00.000Z",
    updatedAt: "2024-06-14T17:00:00.000Z",
  },
  {
    id: "sprint_002",
    projectId: "proj_001",
    name: "Sprint 2: Core Features",
    goal: "Build dashboard layout, create API endpoints, and write unit tests.",
    status: SPRINT_STATUS.ACTIVE,
    startDate: "2024-06-15",
    endDate: "2024-06-28",
    createdAt: "2024-06-14T09:00:00.000Z",
    updatedAt: "2025-03-09T14:30:00.000Z",
  },

  // ── MOB — Mobile App ─────────────────────────────────────────────────────
  {
    id: "sprint_003",
    projectId: "proj_002",
    name: "Sprint 1: Design & Setup",
    goal: "Complete wireframes and initialize the React Native project.",
    status: SPRINT_STATUS.ACTIVE,
    startDate: "2024-07-15",
    endDate: "2024-08-10",
    createdAt: "2024-07-10T09:00:00.000Z",
    updatedAt: "2025-03-08T14:30:00.000Z",
  },

  // ── DSN — Design System ──────────────────────────────────────────────────
  {
    id: "sprint_004",
    projectId: "proj_003",
    name: "Sprint 1: Primitives",
    goal: "Define color palette, build button components, and set up typography system.",
    status: SPRINT_STATUS.PLANNING,
    startDate: "2025-01-20",
    endDate: "2025-02-03",
    createdAt: "2025-01-10T09:00:00.000Z",
    updatedAt: "2025-01-10T09:00:00.000Z",
  },
];
