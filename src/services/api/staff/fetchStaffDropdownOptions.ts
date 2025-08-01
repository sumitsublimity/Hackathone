import { getStaffKeyValueList } from "../staff/staff";

export async function fetchStaffDropdownOptions(siteId: string) {
  try {
    const response = await getStaffKeyValueList({
      searchFilters: [
        {
          columnName: "siteID",
          columnType: "STRING",
          columnValue: siteId,
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
    const staff = response.responsePacket || [];
    return staff.map((staff: any) => ({
      label: `${staff.firstName} ${staff.lastName}`,
      value: String(staff.id),
    }));
  } catch (error) {
    console.error("Failed to fetch staff options:", error);
    return [];
  }
}
