import { z } from "zod";

export const staffSchema = z
  .object({
    firstname: z
      .string({
        required_error: "First name is required",
      })
      .trim()
      .min(1, "First name is required"),

    lastname: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(1, "Last name is required"),

    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .regex(/^\S*$/, "Email cannot contain spaces")
      .email("Please enter a valid email"),

    password: z
      .string({ required_error: "Password is required" })
      .regex(/^\S*$/, "Password cannot contain spaces")
      .min(1, "Password is required"),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(1, "Confirm password is required"),

    accessLevel: z.string({ required_error: "Access level is required" }),
    siteID: z.string({ required_error: "Site is required" }),
    appAccess: z.enum(["yes", "no"], {
      required_error: "App access must be 'yes' or 'no'",
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
