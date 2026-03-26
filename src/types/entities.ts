import type { Role, UserStatus } from "@/constants";

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
