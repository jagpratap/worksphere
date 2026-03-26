const MODE = import.meta.env.MODE as "development" | "production" | "test";

export const ENV = {
  MODE,
  isDev: MODE === "development",
  isProd: MODE === "production",
  isTest: MODE === "test",

  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW !== "false",
} as const;
