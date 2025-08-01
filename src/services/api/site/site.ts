import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import {
  SiteEditDetail,
  SiteFormPayload,
  toggleSitePayload,
  GetSiteQueryParams,
} from "@/utils/interface";

export async function getSiteList(params: GetSiteQueryParams) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    inActive: params.inActive.toString(),
    search: params.search || "",
  });

  const url = `${UrlConfig.GET_SITE_LIST}?${queryParams.toString()}`;
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function addSite(payload: SiteFormPayload) {
  const res = await axiosInstance.post(UrlConfig.CREATE_SITE_POST, payload);
  return res.data;
}

export async function uploadLogo(payload: FormData) {
  const res = await axiosInstance.post(UrlConfig.UPLOAD_LOGO, payload);
  return res.data;
}

export async function EditSiteDetails({ payload, id }: SiteEditDetail) {
  const res = await axiosInstance.put(`${UrlConfig.EDIT_SITE_PUT}${id}`, {
    ...payload,
  });
  return res;
}

export async function getSiteDetailById(id: string) {
  const res = await axiosInstance.get(`${UrlConfig.GET_SITE_DETAILS}${id}`);
  return res.data;
}

export async function toggleInactiveSite(
  payload: toggleSitePayload,
  id: string,
) {
  const res = await axiosInstance.put(
    `${UrlConfig.EDIT_SITE_PUT}${id}`,
    payload,
  );
  return res;
}

export async function getAllotedPackage() {
  // TODO: URL is different from the baseURL. It is used temporarily:
  const res = await axiosInstance.get(
    "http://nurseryapi.sublimitysoft.com/api/autocode/nursery-package",
  );
  return res.data;
}
