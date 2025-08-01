import { formatPercentage } from "@/utils/valueFormatters";
import { calculateGrandTotal } from "../lib/calculateGrandTotal";
import { payrollRows, privateIncomeRows } from "../configs/tableConfigs";
import { KPIDashboardEntry } from "../types/kpiDashboard.types";

export function useStaffTurnoverRatio(data: KPIDashboardEntry[]) {
  const pvtIncomeGrandTotal = calculateGrandTotal(data, privateIncomeRows);
  const payrollGrandTotal = calculateGrandTotal(data, payrollRows);

  const rawRatio =
    typeof payrollGrandTotal === "number" && payrollGrandTotal !== 0
      ? payrollGrandTotal / pvtIncomeGrandTotal
      : 0;

  const formattedRatio = formatPercentage(rawRatio);
  return formattedRatio;
}
