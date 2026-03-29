import { authHandlers } from "./auth";
import { projectHandlers } from "./projects";
import { sprintHandlers } from "./sprints";
import { taskHandlers } from "./tasks";
import { timeEntryHandlers } from "./time-entries";
import { workloadHandlers } from "./workload";

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...sprintHandlers,
  ...taskHandlers,
  ...timeEntryHandlers,
  ...workloadHandlers,
];
