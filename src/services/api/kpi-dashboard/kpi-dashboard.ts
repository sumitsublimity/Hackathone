import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import {
  GenericQueryPayload,
  GetKPIDashboardParams,
  KPIDashboardPayload,
} from "@/utils/interface";

export async function addEditKPIDashboard(payload: KPIDashboardPayload) {
  const res = await axiosInstance.post(
    UrlConfig.ADD_EDIT_KPI_DASHBOARD,
    payload,
  );

  return res.data;
}

export async function getKPIDashboardEditableData(
  payload: GenericQueryPayload,
) {
  const res = await axiosInstance.post(
    UrlConfig.GET_KPI_DASHBOARD_EDITABLE_DATA,
    payload,
  );

  return res.data?.responsePacket ?? [];
}

export async function getKPIDashboardData(params: GetKPIDashboardParams) {
  const queryParams = new URLSearchParams({
    siteID: params.selectedSiteID.toString(),
    year: params.selectedYear.toString(),
  });

  const url = `${UrlConfig.GET_KPI_DASHBOARD_DATA}?${queryParams.toString()}`;

  const res = await axiosInstance.get(url);
  return res.data?.responsePacket ?? [];
}
