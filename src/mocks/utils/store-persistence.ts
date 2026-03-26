import type { MockUser } from "../fixtures/users";

import { FIXTURE_USERS } from "../fixtures/users";

/* =========================================================
   Keys
========================================================= */
const KEYS = {
  refreshTokenStore: "msw:refreshTokenStore",
  registeredUsers: "msw:registeredUsers",
  passwordResetTokenStore: "msw:passwordResetTokenStore",
  emailVerificationStore: "msw:emailVerificationStore",
} as const;

/* =========================================================
   Types
========================================================= */
type RefreshTokenEntry = { userId: string; createdAt: number };
type TokenExpiryEntry = { token: string; expiresAt: number };

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
    try {
      const raw = localStorage.getItem(KEYS.registeredUsers);
      const registered: MockUser[] = raw ? JSON.parse(raw) : [];
      return [...FIXTURE_USERS, ...registered];
    }
    catch {
      return [...FIXTURE_USERS];
    }
  },

  findUserByEmail(email: string): MockUser | null {
    return this.getUsers().find(u => u.email === email) ?? null;
  },

  findUserById(id: string): MockUser | null {
    return this.getUsers().find(u => u.id === id) ?? null;
  },

  addUser(user: MockUser): void {
    try {
      const raw = localStorage.getItem(KEYS.registeredUsers);
      const registered: MockUser[] = raw ? JSON.parse(raw) : [];
      registered.push(user);
      localStorage.setItem(KEYS.registeredUsers, JSON.stringify(registered));
    }
    catch {
      console.warn("[MSW] Failed to add user");
    }
  },

  /**
   * Updates a user by ID. Fixture users are updated in-memory only (reset on
   * page reload), while registered users are persisted to localStorage.
   */
  updateUser(id: string, updates: Partial<MockUser>): void {
    try {
      const fixtureIds = new Set(FIXTURE_USERS.map(u => u.id));

      if (fixtureIds.has(id)) {
        const index = FIXTURE_USERS.findIndex(u => u.id === id);
        if (index !== -1)
          Object.assign(FIXTURE_USERS[index], updates);
        return;
      }

      const raw = localStorage.getItem(KEYS.registeredUsers);
      const registered: MockUser[] = raw ? JSON.parse(raw) : [];
      const index = registered.findIndex(u => u.id === id);
      if (index === -1)
        return;
      registered[index] = { ...registered[index], ...updates };
      localStorage.setItem(KEYS.registeredUsers, JSON.stringify(registered));
    }
    catch {
      console.warn("[MSW] Failed to update user");
    }
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
