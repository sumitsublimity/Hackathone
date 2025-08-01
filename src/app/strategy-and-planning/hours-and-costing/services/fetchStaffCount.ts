import { getStaffKeyValueList } from "@/services/api/staff/staff";
import { Staff, StaffListResponse } from "../types/types";

export async function fetchStaffCount(siteId: string): Promise<number> {
  try {
    const response = (await getStaffKeyValueList({
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
    })) as StaffListResponse;

    const staffList: Staff[] = response.responsePacket;

    return staffList.length;
  } catch (error) {
    console.error("Failed to get staff count", error);
    return 0;
  }
}
