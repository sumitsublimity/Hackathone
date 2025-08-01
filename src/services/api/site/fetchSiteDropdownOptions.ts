import { SiteValuePayload } from "@/utils/interface";
import { getSiteKeyValueList } from "../staff/staff";
import { useQuery } from "@tanstack/react-query";

export type SiteDropdownOption = {
  label: string;
  value: string;
  ageGroup: String[];
  classRoom?: string;
};

export async function fetchSiteDropdownOptions(): Promise<
  SiteDropdownOption[]
> {
  try {
    const response = await getSiteKeyValueList({
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
    });

    const sites = response.responsePacket || [];
    return sites.map(
      (site: {
        name: string;
        id: string | number;
        ageGroup: string[];
      }): SiteDropdownOption => ({
        label: site.name,
        value: String(site.id),
        ageGroup: site.ageGroup,
      }),
    );
  } catch (error) {
    console.error("Failed to fetch site options:", error);
    return [];
  }
}

export function useSiteDropdownList() {
  return useQuery({
    queryKey: ["GET_SITE_LIST"],
    queryFn: async () => {
      const payload: SiteValuePayload = {
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
      };

      const response = await getSiteKeyValueList(payload);
      const sites = response.responsePacket || [];

      return sites.map(
        (site: {
          name: string;
          id: string | number;
          ageGroup: string[];
          numberOfClassrooms: string;
        }): SiteDropdownOption => ({
          label: site.name,
          value: String(site.id),
          ageGroup: site.ageGroup,
          classRoom: site.numberOfClassrooms,
        }),
      );
    },
  });
}
