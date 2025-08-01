import { getCostingData } from "@/services/api/strategyAndPlanning/hoursAndCosting";
import { CostingApiResponse, CostingResponsePacket } from "../types/types";

export async function fetchCostingData(
  siteID: string,
): Promise<CostingResponsePacket[]> {
  try {
    const response: CostingApiResponse = await getCostingData({
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

    const costingData = response?.responsePacket;

    return costingData ?? [];
  } catch (error) {
    console.error("Failed to get costing data", error);
    return [];
  }
}
