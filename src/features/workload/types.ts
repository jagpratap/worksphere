import type { TaskStatus } from "@/constants";
import type { SafeUser } from "@/types";

export type MemberWorkload = {
  user: SafeUser;
  tasksByStatus: Record<TaskStatus, number>;
  totalTasks: number;
};
