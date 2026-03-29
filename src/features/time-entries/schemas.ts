import { z } from "zod";

export const createTimeEntrySchema = z.object({
  taskId: z.string().min(1, "Task is required"),
  minutes: z
    .number({ error: "Time is required" })
    .min(1, "Time must be at least 1 minute")
    .max(480, "Time cannot exceed 8 hours"),
  date: z.string().min(1, "Date is required"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer"),
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial();

export type CreateTimeEntryFormValues = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryFormValues = z.infer<typeof updateTimeEntrySchema>;
