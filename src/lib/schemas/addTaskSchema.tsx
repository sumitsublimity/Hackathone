import { z } from "zod";

export const addTaskSchema = z.object({
  taskPeriod: z.string({ required_error: "Period is required" }),
  taskOccurrence: z.string({ required_error: "Occurrence is required" }),
  addTaskText: z.string().trim().min(1, "Task is required"),
});
