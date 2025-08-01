import { WORKING_DAYS_PER_WEEK } from "../constants/constants";
import { GenerateStaffTableParams, StaffRow } from "../types/types";

export function generateStaffTable(
  config: GenerateStaffTableParams,
): StaffRow[] {
  const { staffCount, ratio, hoursPerDay } = config;

  const table: StaffRow[] = [];

  for (let i = 1; i <= staffCount; i++) {
    const children = i * ratio;
    const totalHours = children * hoursPerDay;
    const weeklyHours = totalHours * WORKING_DAYS_PER_WEEK;

    table.push({
      staff: i.toString().padStart(2, "0"),
      children,
      hoursPerDay,
      totalHours,
      weeklyHours,
    });
  }

  return table;
}
