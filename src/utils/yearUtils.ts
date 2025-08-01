import { format } from "date-fns";

export interface YearOption {
  label: string;
  value: string;
}

/**
 * Returns an array of year options:
 * previous 3 years, current year, and next year
 * in descending order.
 */
export function getFiveYearOptions(): {
  currentYear: string;
  yearOptions: YearOption[];
} {
  const currentYear = new Date().getFullYear();
  const options: YearOption[] = [];

  for (let i = currentYear + 1; i >= currentYear - 3; i--) {
    const yearString = String(i);
    options.push({ label: yearString, value: yearString });
  }

  return {
    currentYear: String(currentYear),
    yearOptions: options,
  };
}

export function formatEnglishNumber(num: number): string {
  return num?.toLocaleString("en-US");
}
export function formatDateForAPI(date?: Date | string) {
  return date ? format(new Date(date), "yyyy-MM-dd") : "";
}

export function getDateRange(
  start: Date | string,
  end: Date | string,
  dateFormat: string = "yyyy-MM-dd",
  separator: string = "#",
): string {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date input.");
  }

  return `${format(startDate, dateFormat)}${separator}${format(endDate, dateFormat)}`;
}
