import { getSiteKeyValueList } from "@/services/api/staff/staff";
import {
  AgeGroupOption,
  SiteKeyValue,
  SiteKeyValueListResponse,
} from "../types/types";

export async function fetchAgeGroupOptions(
  siteId: string,
): Promise<AgeGroupOption[]> {
  try {
    const response = (await getSiteKeyValueList({
      searchFilters: [
        {
          columnName: "inActive",
          columnType: "BOOLEAN",
          columnValue: false,
          operation: "EQUAL_TO",
        },
      ],
      sortRules: [
        {
          columnName: "name",
          operation: "ASC",
        },
      ],
    })) as SiteKeyValueListResponse;

    const sites = response.responsePacket || [];

    const matchedSite: SiteKeyValue | undefined = sites.find(
      (site: any) => site.id === siteId,
    );

    if (!matchedSite || !Array.isArray(matchedSite.ageGroup)) return [];

    return matchedSite.ageGroup.map((group: string) => ({
      label: group,
      value: group,
    }));
  } catch (error) {
    console.error("Failed to fetch age groups for siteId:", siteId, error);
    return [];
  }
}
