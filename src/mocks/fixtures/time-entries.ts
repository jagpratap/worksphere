import type { TimeEntry } from "@/types";

export type MockTimeEntry = TimeEntry;

export const FIXTURE_TIME_ENTRIES: MockTimeEntry[] = [
  // ── Carol (usr_005) — WSP tasks ──────────────────────────────────────────
  {
    id: "time_001",
    taskId: "task_001",
    userId: "usr_005",
    projectId: "proj_001",
    minutes: 180,
    description: "Set up Vite + TypeScript project scaffolding",
    date: "2024-06-03",
    createdAt: "2024-06-03T17:00:00.000Z",
    updatedAt: "2024-06-03T17:00:00.000Z",
  },
  {
    id: "time_002",
    taskId: "task_003",
    userId: "usr_005",
    projectId: "proj_001",
    minutes: 240,
    description: "JWT auth flow with refresh token rotation",
    date: "2024-06-06",
    createdAt: "2024-06-06T18:00:00.000Z",
    updatedAt: "2024-06-06T18:00:00.000Z",
  },
  {
    id: "time_003",
    taskId: "task_016",
    userId: "usr_005",
    projectId: "proj_004",
    minutes: 120,
    description: "Token bucket rate limiter implementation",
    date: "2025-03-14",
    createdAt: "2025-03-14T16:00:00.000Z",
    updatedAt: "2025-03-14T16:00:00.000Z",
  },

  // ── Frank (usr_006) — WSP + MOB tasks ────────────────────────────────────
  {
    id: "time_004",
    taskId: "task_002",
    userId: "usr_006",
    projectId: "proj_001",
    minutes: 300,
    description: "Database schema design and review",
    date: "2024-06-05",
    createdAt: "2024-06-05T18:00:00.000Z",
    updatedAt: "2024-06-05T18:00:00.000Z",
  },
  {
    id: "time_005",
    taskId: "task_008",
    userId: "usr_006",
    projectId: "proj_002",
    minutes: 150,
    description: "Expo project init with navigation setup",
    date: "2024-08-06",
    createdAt: "2024-08-06T17:00:00.000Z",
    updatedAt: "2024-08-06T17:00:00.000Z",
  },

  // ── Grace (usr_007) — WSP + DSN tasks ────────────────────────────────────
  {
    id: "time_006",
    taskId: "task_004",
    userId: "usr_007",
    projectId: "proj_001",
    minutes: 210,
    description: "Dashboard layout with sidebar and header components",
    date: "2025-03-09",
    createdAt: "2025-03-09T15:00:00.000Z",
    updatedAt: "2025-03-09T15:00:00.000Z",
  },
  {
    id: "time_007",
    taskId: "task_012",
    userId: "usr_007",
    projectId: "proj_003",
    minutes: 90,
    description: "Semantic color token definitions for light/dark themes",
    date: "2025-03-12",
    createdAt: "2025-03-12T11:30:00.000Z",
    updatedAt: "2025-03-12T11:30:00.000Z",
  },

  // ── Isla (usr_009) — MOB tasks ───────────────────────────────────────────
  {
    id: "time_008",
    taskId: "task_007",
    userId: "usr_009",
    projectId: "proj_002",
    minutes: 360,
    description: "Low-fidelity wireframes for all core screens",
    date: "2024-07-20",
    createdAt: "2024-07-20T18:00:00.000Z",
    updatedAt: "2024-07-20T18:00:00.000Z",
  },

  // ── James (usr_010) — MOB + AGW tasks ────────────────────────────────────
  {
    id: "time_009",
    taskId: "task_009",
    userId: "usr_010",
    projectId: "proj_002",
    minutes: 60,
    description: "Firebase Cloud Messaging research and spike",
    date: "2024-08-11",
    createdAt: "2024-08-11T12:00:00.000Z",
    updatedAt: "2024-08-11T12:00:00.000Z",
  },

  // ── Leo (usr_012) — DSN tasks ────────────────────────────────────────────
  {
    id: "time_010",
    taskId: "task_013",
    userId: "usr_012",
    projectId: "proj_003",
    minutes: 270,
    description: "Button variants: primary, secondary, ghost, destructive, link",
    date: "2025-03-11",
    createdAt: "2025-03-11T16:30:00.000Z",
    updatedAt: "2025-03-11T16:30:00.000Z",
  },
];
