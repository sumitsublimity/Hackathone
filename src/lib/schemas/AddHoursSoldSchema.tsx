import { z } from "zod";

export const AddHoursSoldSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .min(1, "Month is required"),
  year: z
    .string({ required_error: "year is required" })
    .min(1, "year is required"),
  week1: z
    .string({ required_error: "Week is required" })
    .trim()
    .min(1, "Week is required"),

  week2: z.string().trim().optional(),
  week3: z.string().trim().optional(),
  week4: z.string().trim().optional(),
  extra: z.string().trim().optional(),

  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  ageGroup: z
    .string({ required_error: "Age Group is required" })
    .min(1, "Age Group is required"),
});
