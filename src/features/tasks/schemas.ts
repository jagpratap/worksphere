import { z } from "zod";

import type { TaskPriority, TaskStatus } from "@/constants";

import { TASK_PRIORITY, TASK_STATUS } from "@/constants";

const taskStatusValues = Object.values(TASK_STATUS) as [TaskStatus, ...TaskStatus[]];
const taskPriorityValues = Object.values(TASK_PRIORITY) as [TaskPriority, ...TaskPriority[]];

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer"),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
  assigneeId: z.string().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
