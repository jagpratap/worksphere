import { authHandlers } from "./auth";
import { projectHandlers } from "./projects";
import { taskHandlers } from "./tasks";

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...taskHandlers,
];
