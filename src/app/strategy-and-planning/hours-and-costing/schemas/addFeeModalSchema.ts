import { z } from "zod";

export const addFeeModalSchema = z.object({
  category: z.string({ required_error: "Category is required" }),
  ageGroup: z.string({ required_error: "Age group is required" }),
  costing: z
    .string({ required_error: "Fee per hour is required" })
    .min(1, "Fee per hour is required"),
});
