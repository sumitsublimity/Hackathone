import { KPIDashboardEntry, TableRowConfig } from "../types/kpiDashboard.types";

export function calculateGrandTotal(
  data: KPIDashboardEntry[],
  rows: TableRowConfig<KPIDashboardEntry>[],
  rowToSumLabel: string = "Total",
): number {
  // rowToSumLabel is used to find only that row which has that label and then calculate grand total.
  const totalRow = rows.find((row) => row.label === rowToSumLabel);
  if (!totalRow) return 0;

  return data.reduce((sum, entry) => {
    const value = totalRow.getValue(entry);
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}
