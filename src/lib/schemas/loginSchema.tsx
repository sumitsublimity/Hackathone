import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .regex(/^\S*$/, "Email cannot contain spaces")
    .email("Please enter a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .regex(/^\S*$/, "Password cannot contain spaces"),
  grant_type: z.literal("password"),
  client_id: z.literal("NurseryAdmin"),
  scope: z.literal("autocode.read"),
});
