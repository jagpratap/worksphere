import type { Role, UserStatus } from "@/constants";

import { ROLES, USER_STATUS } from "@/constants";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  lastActiveAt: string;
};

export const FIXTURE_USERS: MockUser[] = [
  // ── Admins ────────────────────────────────────────────────────────────────
  {
    id: "usr_001",
    name: "Alice Admin",
    email: "admin@worksphere.dev",
    password: "password123",
    role: ROLES.ADMIN,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastActiveAt: "2025-03-15T10:30:00.000Z",
  },

  // ── Managers ──────────────────────────────────────────────────────────────
  {
    id: "usr_002",
    name: "Bob Manager",
    email: "bob@worksphere.dev",
    password: "password123",
    role: ROLES.MANAGER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-02-15T00:00:00.000Z",
    lastActiveAt: "2025-03-14T09:00:00.000Z",
  },
  {
    id: "usr_003",
    name: "Diana Prince",
    email: "diana@worksphere.dev",
    password: "password123",
    role: ROLES.MANAGER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-03-10T00:00:00.000Z",
    lastActiveAt: "2025-03-13T14:20:00.000Z",
  },
  {
    id: "usr_004",
    name: "Evan Stone",
    email: "evan@worksphere.dev",
    password: "password123",
    role: ROLES.MANAGER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=evan",
    status: USER_STATUS.DEACTIVATED,
    isVerified: true,
    createdAt: "2024-04-01T00:00:00.000Z",
    lastActiveAt: "2025-01-10T08:00:00.000Z",
  },

  // ── Members ───────────────────────────────────────────────────────────────
  {
    id: "usr_005",
    name: "Carol Member",
    email: "carol@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    status: USER_STATUS.ACTIVE,
    isVerified: false,
    createdAt: "2024-03-20T00:00:00.000Z",
    lastActiveAt: "2025-03-12T16:45:00.000Z",
  },
  {
    id: "usr_006",
    name: "Frank Castle",
    email: "frank@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-05-05T00:00:00.000Z",
    lastActiveAt: "2025-03-15T11:00:00.000Z",
  },
  {
    id: "usr_007",
    name: "Grace Hopper",
    email: "grace@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-06-12T00:00:00.000Z",
    lastActiveAt: "2025-03-10T07:30:00.000Z",
  },
  {
    id: "usr_008",
    name: "Henry Ford",
    email: "henry@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=henry",
    status: USER_STATUS.DEACTIVATED,
    isVerified: true,
    createdAt: "2024-07-19T00:00:00.000Z",
    lastActiveAt: "2024-12-01T09:15:00.000Z",
  },
  {
    id: "usr_009",
    name: "Isla Fisher",
    email: "isla@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=isla",
    status: USER_STATUS.ACTIVE,
    isVerified: false,
    createdAt: "2024-08-22T00:00:00.000Z",
    lastActiveAt: "2025-03-14T13:00:00.000Z",
  },
  {
    id: "usr_010",
    name: "James Kirk",
    email: "james@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-09-30T00:00:00.000Z",
    lastActiveAt: "2025-03-11T17:20:00.000Z",
  },
  {
    id: "usr_011",
    name: "Karen Page",
    email: "karen@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karen",
    status: USER_STATUS.DEACTIVATED,
    isVerified: true,
    createdAt: "2024-10-14T00:00:00.000Z",
    lastActiveAt: "2025-02-01T10:00:00.000Z",
  },
  {
    id: "usr_012",
    name: "Leo Messi",
    email: "leo@worksphere.dev",
    password: "password123",
    role: ROLES.MEMBER,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=leo",
    status: USER_STATUS.ACTIVE,
    isVerified: true,
    createdAt: "2024-11-03T00:00:00.000Z",
    lastActiveAt: "2025-03-15T08:45:00.000Z",
  },
];
