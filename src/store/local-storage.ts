const REFRESH_TOKEN_KEY = "worksphere:refreshToken" as const;

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    catch {
      return null;
    }
  },

  set: (token: string): void => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
    catch {
      console.warn("[tokenStorage] Failed to persist refresh token");
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    catch {
      console.warn("[tokenStorage] Failed to clear refresh token");
    }
  },
};
