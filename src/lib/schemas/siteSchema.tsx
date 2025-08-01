import { z } from "zod";
const phoneRegex = /^[0-9]+$/;
export const siteSchema = z.object({
  name: z
    .string({ required_error: "Site name is required" })
    .trim()
    .min(1, "Site name is required"),
  ageGroup: z
    .array(
      z.object({
        value: z
          .string()
          .trim() // ✅ apply trim on the string, not the array
          .min(1, "Age group is required")
          .max(50, "Age group must be less than 50 characters"),
      }),
    )
    .min(1, "At least one age group is required"),

  numberOfClassrooms: z
    .string({ required_error: "No. of Classrooms is required" })
    .trim()
    .min(1, "No. of Classrooms is required")
    .max(3),
  operatingHoursCapacity: z
    .string({ required_error: "Operating Capacity (Hrs) is required" })
    .trim()
    .min(1, "Operating Capacity (Hrs) is required"),

  siteEmail: z
    .string({ required_error: "Site email is required" })
    .trim()
    .email("Please enter valid site email"),
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(1, "First name is required"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .trim()
    .min(1, "Last name is required"),
  telephoneNumber: z
    .string({ required_error: "Telephone number is required" })
    .trim()
    .min(1, "Telephone number is required.")
    .min(7, "Telephone number should be (7-15) digits.")
    .max(15, "Telephone number cannot exceed 15 digits")
    .regex(phoneRegex, "Telephone must contain only digits. "),
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .min(1, "Mobile number is required")
    .min(7, "Mobile number should be (7-15) digits.")
    .max(15, "Mobile number cannot exceed 15 digits")
    .regex(phoneRegex, "Mobile number must contain only digits"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please enter valid email"),
  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(1, "Location is required"),
  logoUrl: z.any().optional(),
});
