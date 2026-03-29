import { z } from "zod";

import type { ProjectColor, ProjectStatus } from "@/constants";

import { PROJECT_COLORS, PROJECT_STATUS } from "@/constants";

const projectStatusValues = Object.values(PROJECT_STATUS) as [ProjectStatus, ...ProjectStatus[]];
const projectColorValues = Object.values(PROJECT_COLORS) as [ProjectColor, ...ProjectColor[]];

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(5, "Key must be 5 characters or fewer")
    .regex(/^[A-Z]+$/i, "Key must contain only letters")
    .transform(v => v.toUpperCase()),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer"),
  status: z.enum(projectStatusValues),
  color: z.enum(projectColorValues),
  memberIds: z.array(z.string()),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
