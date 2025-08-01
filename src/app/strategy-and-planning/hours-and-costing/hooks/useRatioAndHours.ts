import { getRatioAndHours } from "@/services/api/strategyAndPlanning/hoursAndCosting";
import { useQuery } from "@tanstack/react-query";

export const useRatioAndHours = (siteID: string) => {
  return useQuery({
    queryKey: ["ratioAndHours", siteID],

    queryFn: () => {
      return getRatioAndHours({
        searchFilters: [
          {
            columnName: "siteID",
            columnType: "COLLECTION_OBJECT",
            columnValue: siteID,
            operation: "EQUAL_TO",
          },
        ],
        sortRules: [],
      });
    },

    enabled: !!siteID,

    retry: false,
  });
};
