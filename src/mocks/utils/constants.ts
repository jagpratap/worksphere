// Token TTLs
// _SEC suffix → used with JWT exp (Unix seconds)
// _MS suffix  → used with Date.now() (milliseconds)
export const ACCESS_TOKEN_TTL_SEC = 60 * 60; // 1 hour
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const REFRESH_ROTATE_MS = 24 * 60 * 60 * 1000; // 1 day
export const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

// Base URLs
export const AUTH_BASE_URL = "/api/auth";
export const PROJECTS_BASE_URL = "/api/projects";
export const SPRINTS_BASE_URL = "/api/sprints";
export const TASKS_BASE_URL = "/api/tasks";
export const TIME_ENTRIES_BASE_URL = "/api/time-entries";
export const USERS_BASE_URL = "/api/users";
export const WORKLOAD_BASE_URL = "/api/workload";
