import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import { FilterCondition, SortRules } from "@/utils/interface";

export interface AddRatioAndHoursPayload {
  childrenPerStaff: string;
  workingHoursPerDay: string;
  siteID: string;
}
export interface UpdateRatioAndHoursPayload {
  childrenPerStaff: string;
  workingHoursPerDay: string;
  siteID: string;
}

export interface GetRatioAndHoursPayload {
  searchFilters: FilterCondition[];
  sortRules: SortRules[];
}

export interface AddFeePayload {
  category: string;
  ageGroup: string;
  costing: string;
  siteID: string;
}

export async function addRatioAndHours(payload: AddRatioAndHoursPayload) {
  const res = await axiosInstance.post(UrlConfig.ADD_RATIO_AND_HOURS, payload);
  return res.data;
}

export async function updateRatioAndHours(
  ratioID: string,
  payload: UpdateRatioAndHoursPayload,
) {
  const url = `${UrlConfig.EDIT_RATIO_AND_HOURS}${ratioID}`;

  const res = await axiosInstance.put(url, payload);
  return res.data;
}

export async function getRatioAndHours(payload: GetRatioAndHoursPayload) {
  const res = await axiosInstance.post(UrlConfig.GET_RATIO_AND_HOURS, payload);
  return res.data;
}

export async function getCategoryList(payload: GetRatioAndHoursPayload) {
  const res = await axiosInstance.post(UrlConfig.GET_CATEGORY_LIST, payload);
  return res.data;
}

export async function addFee(payload: AddFeePayload) {
  const res = await axiosInstance.post(UrlConfig.ADD_FEE, payload);
  return res.data;
}

export async function getCostingData(payload: GetRatioAndHoursPayload) {
  const res = await axiosInstance.post(UrlConfig.GET_COSTING_DATA, payload);
  return res.data;
}
