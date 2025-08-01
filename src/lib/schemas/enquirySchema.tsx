import { z } from "zod";
export const enquirySchema = z
  .object({
    siteID: z.string({ required_error: "Site is required" }),
    enquiryDate: z.string({ required_error: "Date of enquiry is required" }),
    fullName: z.string().trim().min(1, "Child's name is required"),
    dob: z.string({ required_error: "Child's date of birth is required" }),
    showRoundDate: z.string().optional(),
    staffID: z.string().optional(),
    town: z.string({ required_error: "Town is required" }),
    otherTown: z.string().trim().optional(),
    referralSource: z.string({ required_error: "This field is required" }),
    otherReferralSource: z.string().trim().optional(),
    isStarting: z.string({ required_error: "Please choose an option" }),
    reasonNotStarted: z.string().trim().optional(),
    otherReason: z.string().trim().optional(),
    startDate: z.string().optional(),
    comment: z.string().trim().min(1, "Comments are required"),
    fatherName: z.string().trim().optional(),
    motherName: z.string().trim().optional(),
    workHours: z.string().optional(),
    weeklyIncome: z.string().optional(),
  })
  // Pre-clean unused fields before refinement
  .transform((data) => {
    if (data.isStarting === "Yes") {
      data.reasonNotStarted = "";
      data.otherReason = "";
    } else if (data.isStarting === "No") {
      data.startDate = "";
      data.workHours = "";
      data.weeklyIncome = "";
    }
    return data;
  })
  .refine((data) => data.town !== "Other" || !!data.otherTown?.trim(), {
    path: ["otherTown"],
    message: "Please enter a town name",
  })
  .refine(
    (data) =>
      data.referralSource !== "Other" || !!data.otherReferralSource?.trim(),
    {
      path: ["otherReferralSource"],
      message: "Please enter a referral source",
    },
  )
  .refine(
    (data) => data.reasonNotStarted !== "Other" || !!data.otherReason?.trim(),
    {
      path: ["otherReason"],
      message: "Please enter a reason",
    },
  )
  .refine((data) => data.isStarting !== "Yes" || !!data.startDate, {
    path: ["startDate"],
    message: "Start date is required if starting",
  })
  .refine(
    (data) => data.isStarting !== "No" || !!data.reasonNotStarted?.trim(),
    {
      path: ["reasonNotStarted"],
      message: "Reason is required if not starting",
    },
  ).superRefine((data, ctx) => {
    const hasStaffID = !!data.staffID?.trim();
    const hasShowRoundDate = !!data.showRoundDate?.trim();

    // Case 1: staffID without showRoundDate
    if (hasStaffID && !hasShowRoundDate) {
      ctx.addIssue({
        path: ["showRoundDate"],
        message: "Cannot select 'Shown By' without selecting 'Date of Show Round'",
        code: z.ZodIssueCode.custom,
      });
    }

    // Case 2: showRoundDate without staffID
    if (hasShowRoundDate && !hasStaffID) {
      ctx.addIssue({
        path: ["staffID"],
        message: "Cannot select 'Date of Show Round' without selecting 'Shown By'",
        code: z.ZodIssueCode.custom,
      });
    }
  });
