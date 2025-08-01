import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import {
  StaffCreatePayload,
  StaffEditDetail,
  StaffRoleFilter,
  toggleStaffPayload,
  GetStaffQueryParams,
  SiteValuePayload,
} from "@/utils/interface";

export async function addStaff(payload: StaffCreatePayload) {
  const res = await axiosInstance.post(UrlConfig.CREATE_STAFF, payload);
  return res.data;
}

export async function getStaffDetailById(id: string) {
  const res = await axiosInstance.get(`${UrlConfig.GET_STAFF_DETAIL}${id}`);
  return res.data;
}

export async function EditStaffDetails({ payload, id }: StaffEditDetail) {
  const res = await axiosInstance.put(`${UrlConfig.EDIT_STAFF}${id}`, {
    ...payload,
  });
  return res;
}
export async function getStaffRoleList(payload: StaffRoleFilter) {
  const res = await axiosInstance.post(UrlConfig.GET_STAFF_ROLE_LIST, payload);
  return res.data;
}

export async function getStaffList(params: GetStaffQueryParams) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    inActive: params.inActive.toString(),
    search: params.search || "",
  });

  const url = `${UrlConfig.GET_STAFF_LIST}?${queryParams.toString()}`;
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function toggleInactiveStaff(
  payload: toggleStaffPayload,
  id: string,
) {
  const res = await axiosInstance.put(`${UrlConfig.EDIT_STAFF}${id}`, payload);
  return res;
}

export async function getSiteKeyValueList(payload: SiteValuePayload) {
  const res = await axiosInstance.post(
    UrlConfig.GET_SITE_DROPDOWN_LIST,
    payload,
  );
  return res.data;
}

export async function getStaffKeyValueList(payload: SiteValuePayload) {
  const res = await axiosInstance.post(
    UrlConfig.GET_STAFF_DROPDOWN_LIST,
    payload,
  );
  return res.data;
}
