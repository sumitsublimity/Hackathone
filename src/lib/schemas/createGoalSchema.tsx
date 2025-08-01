import { z } from "zod";

export const createGoalSchema = z.object({
  site: z.string({ required_error: "Site is required" }),
  addGoalYear: z.string({ required_error: "Year is required" }),
  addGoalText: z.string().trim().min(1, "Goal is required"),
});
