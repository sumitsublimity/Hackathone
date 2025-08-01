import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import { AddEnquiryPayload, GetEnquiryPayload } from "@/utils/interface";

export async function addEnquiry(payload: AddEnquiryPayload) {
  const res = await axiosInstance.post(UrlConfig.ADD_ENQUIRY, payload);
  return res.data;
}
export async function getEnquiryList(payload: GetEnquiryPayload) {
  const res = await axiosInstance.post(UrlConfig.GET_ENQUIRY_LIST, payload);
  return res.data;
}

export async function getEnquiryDetailsById(enquiryId: string) {
  const url = `${UrlConfig.GET_ENQUIRY_BY_ID}${enquiryId}`;

  const res = await axiosInstance.get(url);
  return res.data;
}

export async function updateEnquiry(
  enquiryId: string,
  payload: AddEnquiryPayload,
) {
  const url = `${UrlConfig.EDIT_ENQUIRY}${enquiryId}`;

  const res = await axiosInstance.put(url, payload);
  return res.data;
}

export async function deleteEnquiry(payload: string[]) {
  const res = await axiosInstance.post(UrlConfig.DELETE_ENQUIRY, payload);
  return res.data;
}
