import { z } from "zod";

export const budgetSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(1, "Code is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  month: z
    .string({ required_error: "Month is required" })
    .min(1, "Month is required"),
  budget: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  actualBudget: z.string().optional(),
});
