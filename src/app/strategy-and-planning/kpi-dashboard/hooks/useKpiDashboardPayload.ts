import { useMemo } from "react";
import { GenericQueryPayload } from "@/utils/interface";

interface UseKpiDashboardPayloadProps {
  siteID: string;
  year: number | string;
  selectedMonth: string;
}

export function useKpiDashboardPayload({
  siteID,
  year,
  selectedMonth,
}: UseKpiDashboardPayloadProps): GenericQueryPayload {
  return useMemo(
    () => ({
      searchFilters: [
        {
          columnName: "siteID",
          columnType: "COLLECTION_OBJECT",
          columnValue: siteID,
          operation: "EQUAL_TO",
        },
        {
          columnName: "year",
          columnType: "INTEGER",
          columnValue: Number(year),
          operation: "EQUAL_TO",
        },
        {
          columnName: "month",
          columnType: "COLLECTION_OBJECT",
          columnValue: selectedMonth,
          operation: "EQUAL_TO",
        },
      ],
      sortRules: [],
    }),
    [siteID, year, selectedMonth],
  );
}
