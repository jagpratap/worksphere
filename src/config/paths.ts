export const paths = {
  // ── Public ────────────────────────────────────────────────────────────────
  home: {
    path: "/",
  },

  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    signin: {
      path: "/auth/signin",
      getHref: (redirectTo?: string | null) =>
        `/auth/signin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    signup: {
      path: "/auth/signup",
      getHref: (redirectTo?: string | null) =>
        `/auth/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    forgotPassword: {
      path: "/auth/forgot-password",
    },
    resetPassword: {
      path: "/auth/reset-password",
      getHref: (email: string, token: string) =>
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    },
    verifyEmail: {
      path: "/auth/verify-email",
      getHref: (email: string, token: string) =>
        `/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    },
  },

  // ── Admin (ROLES.ADMIN only) ── /admin/* ─────────────────────────────────
  admin: {
    root: {
      path: "/admin",
    },
    users: {
      path: "/admin/users",
    },
    billing: {
      path: "/admin/billing",
    },
    auditLog: {
      path: "/admin/audit-log",
    },
  },

  // ── App / Manager (ROLES.ADMIN + ROLES.MANAGER) ── /app/* ───────────────
  app: {
    root: {
      path: "/app",
    },
    projects: {
      root: {
        path: "/app/projects",
      },
      detail: (id = ":id") => ({
        path: `/app/projects/${id}`,
      }),
      board: (id = ":id") => ({
        path: `/app/projects/${id}/board`,
      }),
      sprints: (id = ":id") => ({
        path: `/app/projects/${id}/sprints`,
      }),
    },
    workload: {
      path: "/app/workload",
    },
  },

  // ── My / Member (all authenticated) ── /my/* ────────────────────────────
  my: {
    tasks: {
      root: {
        path: "/my/tasks",
      },
      detail: (id = ":id") => ({
        path: `/my/tasks/${id}`,
      }),
    },
    timeTracker: {
      path: "/my/time",
    },
  },

  // ── Shared (all authenticated) ── /shared/* ─────────────────────────────
  shared: {
    profile: {
      path: "/shared/profile",
    },
    settings: {
      path: "/shared/settings",
    },
    notifications: {
      path: "/shared/notifications",
    },
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  unauthorized: {
    path: "/unauthorized",
  },
} as const;
