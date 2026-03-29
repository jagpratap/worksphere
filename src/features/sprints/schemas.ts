import { z } from "zod";

import type { SprintStatus } from "@/constants";

import { SPRINT_STATUS } from "@/constants";

const sprintStatusValues = Object.values(SPRINT_STATUS) as [SprintStatus, ...SprintStatus[]];

export const createSprintSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  goal: z
    .string()
    .max(500, "Goal must be 500 characters or fewer"),
  status: z.enum(sprintStatusValues),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine(
  data => data.endDate > data.startDate,
  { message: "End date must be after start date", path: ["endDate"] },
);

export const updateSprintSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer")
    .optional(),
  goal: z
    .string()
    .max(500, "Goal must be 500 characters or fewer")
    .optional(),
  status: z.enum(sprintStatusValues).optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().min(1, "End date is required").optional(),
});

export type CreateSprintFormValues = z.infer<typeof createSprintSchema>;
export type UpdateSprintFormValues = z.infer<typeof updateSprintSchema>;
