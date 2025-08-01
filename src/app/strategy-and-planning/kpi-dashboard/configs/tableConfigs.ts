import { KPIDashboardEntry, TableRowConfig } from "../types/kpiDashboard.types";
import { formatCurrency, formatNumber } from "@/utils/valueFormatters";

export const MONTHS = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

export const privateIncomeRows: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Private Income",
    getValue: (entry) => entry.privateIncome?.privateIncome,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Funding 3yr",
    getValue: (entry) => entry.privateIncome?.threeYearFunding,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Funding 2yr",
    getValue: (entry) => entry.privateIncome?.twoYearFunding,
    format: (value) => formatCurrency(value),
  },
  {
    label: "SENif",
    getValue: (entry) => entry.privateIncome?.senif,
    format: (value) => formatCurrency(value),
  },
  {
    label: "DAF",
    getValue: (entry) => entry.privateIncome?.daf,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Total",
    getValue: (entry) => entry.totalPrivateIncome,
    format: (value) => formatCurrency(value),
  },
];

export const payrollRows: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Payroll",
    getValue: (entry) => entry.payroll?.payroll,
    format: (value) => formatCurrency(value),
  },
  {
    label: "PAYE",
    getValue: (entry) => entry.payroll?.paye,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Pension",
    getValue: (entry) => entry.payroll?.pension,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Total",
    getValue: (entry) => entry.totalPayroll,
    format: (value) => formatCurrency(value),
  },
];

export const staffToTurnover: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Staff to Turnover Ratio",
    getValue: (entry) => entry.turnOverRatio,
    format: (value) => {
      if (typeof value !== "undefined") {
        return `${value}%`;
      } else {
        return "-";
      }
    },
  },
];

export const cashInSales: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Cash In Sales",
    getValue: (entry) => entry.cashInSales,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Total",
    getValue: (entry) => entry.cashInSales,
    format: (value) => formatCurrency(value),
  },
];

export const cashOut: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Cash Out",
    getValue: (entry) => entry.cashOut,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Total",
    getValue: (entry) => entry.cashOut,
    format: (value) => formatCurrency(value),
  },
];

export const spendingOnBudget: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Total Hours Charged",
    getValue: (entry) => entry.totalHoursSold,
    format: (value) => formatNumber(value),
  },
  {
    label: "Total Spend (All Budget Codes)",
    getValue: (entry) => entry.spendOnBudget,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Cost Per Hour",
    getValue: (entry) => entry.costPerHour,
    format: (value) => formatCurrency(value),
  },
];

export const savings: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Savings",
    getValue: (entry) => entry.savings,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Profit/Loss",
    getValue: (entry) => entry.profit,
    format: (value) => formatCurrency(value),
  },
];

export const rev: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "REV",
    getValue: (entry) => entry.rev,
    format: (value) => formatCurrency(value),
  },
  {
    label: "Difference",
    getValue: (entry) => entry.difference,
    format: (value) => formatCurrency(value),
  },
];

export const margin: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Margin",
    getValue: (entry) => entry.margin,
    format: (value) => formatCurrency(value),
  },
];

export const cashCollectedTurnover: TableRowConfig<KPIDashboardEntry>[] = [
  {
    label: "Cash Collected Turnover",
    getValue: (entry) => entry.cashCollectedTurnOver,
    format: (value) => formatCurrency(value),
  },
];
