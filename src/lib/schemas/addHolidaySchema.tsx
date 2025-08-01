import { z } from "zod";

export const addHolidaySchema = z.object({
  holidayDate: z.string({ required_error: "Holiday date is required" }),
  holiday: z
    .string({ required_error: "Holiday is required" })
    .trim()
    .min(1, "Holiday is required"),
});
