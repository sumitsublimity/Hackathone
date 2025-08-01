import { z } from "zod";

export const addPvtIncomeSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  privateIncome: z
    .string({ required_error: "Private income is required" })
    .trim()
    .min(1, "Private income is required"),
  threeYearFunding: z
    .string({ required_error: "Funding 3yr is required" })
    .trim()
    .min(1, "Funding 3yr is required"),
  twoYearFunding: z
    .string({ required_error: "Funding 2yr is required" })
    .trim()
    .min(1, "Funding 2yr is required"),
  senif: z
    .string({ required_error: "SENif is required" })
    .trim()
    .min(1, "SENif is required"),
  daf: z
    .string({ required_error: "DAF is required" })
    .trim()
    .min(1, "DAF is required"),
});

export const addPayrollSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  payroll: z
    .string({ required_error: "Payroll is required" })
    .trim()
    .min(1, "Payroll is required"),
  paye: z
    .string({ required_error: "PAYE is required" })
    .trim()
    .min(1, "PAYE is required"),
  pension: z
    .string({ required_error: "Pension is required" })
    .trim()
    .min(1, "Pension is required"),
});

export const addCashInSalesSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  cashInSales: z
    .string({ required_error: "Cash In Sales is required" })
    .trim()
    .min(1, "Cash in sales is required"),
});

export const addCashOutSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  cashOut: z
    .string({ required_error: "Cash out is required" })
    .trim()
    .min(1, "Cash out is required"),
});

export const addSpendingOnBudgetSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  spendOnBudget: z
    .string({ required_error: "Total spend is required" })
    .trim()
    .min(1, "Total spend is required"),
});

export const addSavingsSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .trim()
    .min(1, "Month is required"),
  savings: z
    .string({ required_error: "Savings are required" })
    .trim()
    .min(1, "Savings are required"),
});
