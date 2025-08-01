import { getSiteDetailById } from "@/services/api/site/site";
import { SiteDetailResponse } from "../types/types";

export async function getAgeGroupList(siteId: string): Promise<string[]> {
  try {
    const response: SiteDetailResponse = await getSiteDetailById(siteId);

    const siteDetail = response?.responsePacket;

    const ageGroupList = Array.isArray(siteDetail?.ageGroup)
      ? siteDetail.ageGroup
      : [];

    return ageGroupList;
  } catch (error) {
    console.error("Failed to fetch age groups for site", error);
    return [];
  }
}
