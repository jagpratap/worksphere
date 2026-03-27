import type { MockProject } from "../fixtures/projects";
import type { MockTask } from "../fixtures/tasks";
import type { MockUser } from "../fixtures/users";

import { FIXTURE_PROJECTS } from "../fixtures/projects";
import { FIXTURE_TASKS } from "../fixtures/tasks";
import { FIXTURE_USERS } from "../fixtures/users";

/* =========================================================
   Keys
========================================================= */
const KEYS = {
  users: "msw:users",
  tasks: "msw:tasks",
  projects: "msw:projects",
  refreshTokenStore: "msw:refreshTokenStore",
  emailVerificationStore: "msw:emailVerificationStore",
  passwordResetTokenStore: "msw:passwordResetTokenStore",
} as const;

/* =========================================================
   Types
========================================================= */
type RefreshTokenEntry = { userId: string; createdAt: number };
type TokenExpiryEntry = { token: string; expiresAt: number };

/* =========================================================
   Task Key Counter
========================================================= */

const TASK_COUNTERS = new Map<string, number>();

function initCounter(projectKey: string, tasks: MockTask[]): number {
  const prefix = `${projectKey}-`;
  return tasks
    .filter(t => t.key.startsWith(prefix))
    .reduce((max, t) => {
      const num = Number.parseInt(t.key.slice(prefix.length), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);
}

/* =========================================================
   Persisted Collection Helpers
========================================================= */

function readCollection<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw)
      return JSON.parse(raw);
    // First access — seed from fixtures
    localStorage.setItem(key, JSON.stringify(seed));
    return [...seed];
  }
  catch {
    return [...seed];
  }
}

function writeCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  }
  catch {
    console.warn(`[MSW] Failed to persist ${key}`);
  }
}

export const mswStore = {
  // ── Refresh Tokens ──────────────────────────────────────────────────────
  getRefreshToken(token: string): RefreshTokenEntry | null {
    return getRecord<RefreshTokenEntry>(KEYS.refreshTokenStore, token);
  },

  setRefreshToken(token: string, entry: RefreshTokenEntry): void {
    setRecord(KEYS.refreshTokenStore, token, entry);
  },

  deleteRefreshToken(token: string): void {
    deleteRecord(KEYS.refreshTokenStore, token);
  },

  // ── Password Reset Tokens ────────────────────────────────
  getPasswordResetToken(email: string): TokenExpiryEntry | null {
    return getRecord<TokenExpiryEntry>(KEYS.passwordResetTokenStore, email);
  },

  setPasswordResetToken(email: string, entry: TokenExpiryEntry): void {
    setRecord(KEYS.passwordResetTokenStore, email, entry);
  },

  deletePasswordResetToken(email: string): void {
    deleteRecord(KEYS.passwordResetTokenStore, email);
  },

  // ── Email Verification Tokens ────────────────────────────
  getEmailVerificationToken(email: string): TokenExpiryEntry | null {
    return getRecord<TokenExpiryEntry>(KEYS.emailVerificationStore, email);
  },

  setEmailVerificationToken(email: string, entry: TokenExpiryEntry): void {
    setRecord(KEYS.emailVerificationStore, email, entry);
  },

  deleteEmailVerificationToken(email: string): void {
    deleteRecord(KEYS.emailVerificationStore, email);
  },

  // ── Users ────────────────────────────────────────────────
  getUsers(): MockUser[] {
    return readCollection<MockUser>(KEYS.users, FIXTURE_USERS);
  },

  findUserByEmail(email: string): MockUser | null {
    return this.getUsers().find(u => u.email === email) ?? null;
  },

  findUserById(id: string): MockUser | null {
    return this.getUsers().find(u => u.id === id) ?? null;
  },

  addUser(user: MockUser): void {
    const users = this.getUsers();
    users.push(user);
    writeCollection(KEYS.users, users);
  },

  updateUser(id: string, updates: Partial<MockUser>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1)
      return;
    users[index] = { ...users[index], ...updates };
    writeCollection(KEYS.users, users);
  },

  // ── Projects ────────────────────────────────────────────────────────────
  getProjects(): MockProject[] {
    return readCollection<MockProject>(KEYS.projects, FIXTURE_PROJECTS);
  },

  findProjectById(id: string): MockProject | null {
    return this.getProjects().find(p => p.id === id) ?? null;
  },

  addProject(project: MockProject): void {
    const projects = this.getProjects();
    projects.push(project);
    writeCollection(KEYS.projects, projects);
  },

  updateProject(id: string, updates: Partial<MockProject>): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1)
      return;
    projects[index] = { ...projects[index], ...updates };
    writeCollection(KEYS.projects, projects);
  },

  deleteProject(id: string): void {
    const projects = this.getProjects();
    writeCollection(KEYS.projects, projects.filter(p => p.id !== id));
  },

  // ── Tasks ───────────────────────────────────────────────────────────────
  getTasks(): MockTask[] {
    return readCollection<MockTask>(KEYS.tasks, FIXTURE_TASKS);
  },

  getTasksByProject(projectId: string): MockTask[] {
    return this.getTasks().filter(t => t.projectId === projectId);
  },

  getTasksByAssignee(userId: string): MockTask[] {
    return this.getTasks().filter(t => t.assigneeId === userId);
  },

  findTaskById(id: string): MockTask | null {
    return this.getTasks().find(t => t.id === id) ?? null;
  },

  addTask(task: MockTask): void {
    const tasks = this.getTasks();
    tasks.push(task);
    writeCollection(KEYS.tasks, tasks);
  },

  updateTask(id: string, updates: Partial<MockTask>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1)
      return;
    tasks[index] = { ...tasks[index], ...updates };
    writeCollection(KEYS.tasks, tasks);
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks();
    writeCollection(KEYS.tasks, tasks.filter(t => t.id !== id));
  },

  deleteTasksByProject(projectId: string): void {
    const tasks = this.getTasks();
    writeCollection(KEYS.tasks, tasks.filter(t => t.projectId !== projectId));
  },

  // ── Task Key Generation ─────────────────────────────────────────────────
  getNextTaskKey(projectKey: string): string {
    if (!TASK_COUNTERS.has(projectKey)) {
      TASK_COUNTERS.set(projectKey, initCounter(projectKey, this.getTasks()));
    }
    const next = TASK_COUNTERS.get(projectKey)! + 1;
    TASK_COUNTERS.set(projectKey, next);
    return `${projectKey}-${next}`;
  },

  // ── Dev Utils ────────────────────────────────────────────
  clearAll(): void {
    Object.values(KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      }
      catch { console.warn(`[MSW] Failed to clear ${key}`); }
    });
  },
};

/* =========================================================
   Generic localStorage helpers
========================================================= */

function getRecord<T>(storeKey: string, recordKey: string): T | null {
  try {
    const raw = localStorage.getItem(storeKey);
    if (!raw)
      return null;
    const store: Record<string, T> = JSON.parse(raw);
    return store[recordKey] ?? null;
  }
  catch {
    return null;
  }
}

function setRecord<T>(storeKey: string, recordKey: string, value: T): void {
  try {
    const raw = localStorage.getItem(storeKey);
    const store: Record<string, T> = raw ? JSON.parse(raw) : {};
    store[recordKey] = value;
    localStorage.setItem(storeKey, JSON.stringify(store));
  }
  catch {
    console.warn(`[MSW] Failed to set ${storeKey}:${recordKey}`);
  }
}

function deleteRecord(storeKey: string, recordKey: string): void {
  try {
    const raw = localStorage.getItem(storeKey);
    if (!raw)
      return;
    const store: Record<string, unknown> = JSON.parse(raw);
    delete store[recordKey];
    localStorage.setItem(storeKey, JSON.stringify(store));
  }
  catch {
    console.warn(`[MSW] Failed to delete ${storeKey}:${recordKey}`);
  }
}
