import { http } from "msw";

import type { TaskStatus } from "@/constants";

import { ROLES, TASK_STATUS_ORDER } from "@/constants";

import { sanitizeUser, withRole } from "../utils/auth";
import { WORKLOAD_BASE_URL } from "../utils/constants";
import { delay } from "../utils/delay";
import { successResponse } from "../utils/responses";
import { mswStore } from "../utils/store-persistence";

// ── GET /api/workload?projectId= ──────────────────────────────────────────
const getWorkload = http.get(
  WORKLOAD_BASE_URL,
  withRole([ROLES.ADMIN, ROLES.MANAGER], async (_ctx, request) => {
    await delay();

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    const tasks = projectId
      ? mswStore.getTasksByProject(projectId)
      : mswStore.getTasks();

    // Group tasks by assigneeId
    const byAssignee = new Map<string, Record<TaskStatus, number>>();

    for (const task of tasks) {
      if (!task.assigneeId)
        continue;

      if (!byAssignee.has(task.assigneeId)) {
        const counts = {} as Record<TaskStatus, number>;
        for (const status of TASK_STATUS_ORDER) {
          counts[status] = 0;
        }
        byAssignee.set(task.assigneeId, counts);
      }

      const counts = byAssignee.get(task.assigneeId)!;
      counts[task.status] = (counts[task.status] ?? 0) + 1;
    }

    // Build response
    const workload = Array.from(byAssignee.entries())
      .map(([userId, tasksByStatus]) => {
        const user = mswStore.findUserById(userId);
        if (!user)
          return null;

        const totalTasks = Object.values(tasksByStatus).reduce((sum, n) => sum + n, 0);

        return {
          user: sanitizeUser(user),
          tasksByStatus,
          totalTasks,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.totalTasks - a!.totalTasks);

    return successResponse({
      data: workload,
      message: "Workload fetched successfully",
    });
  }),
);

export const workloadHandlers = [getWorkload];
