import { z } from "zod";

export const budgetReviewSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .min(1, "Month is required"),
  head: z
    .string({ required_error: "Head is required" })
    .min(1, "Head is required"),
  budget: z
    .string({ required_error: "Budget is required" })
    .min(1, "Budget is required"),
  actualBudget: z
    .string({ required_error: "Actual is required" })
    .min(1, "Actual is required"),
});
