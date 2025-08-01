import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";

const createHoursSold = async (data: any) => {
  const response = await axiosInstance.post(UrlConfig.CREATE_HOURS_SOLD, data);
  return response;
};
const getHoursSold = async (params: any) => {
  const response = await axiosInstance.get(UrlConfig.GET_HOURS_SOLD, {
    params,
  });
  return response;
};
const getUpdateSold = async (id: any, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `${UrlConfig.UPDATE_HOURS_SOLD}/${id}`,
      payload,
    );
    return response;
  } catch (err: any) {
    console.error("❌ PATCH ERROR:", err.response?.data || err.message);
    throw err;
  }
};

const deleteHoursSold = async (id: any) => {
  try {
    const response = await axiosInstance.post(
      `${UrlConfig.DELETE_HOURS_SOLD}`,
      [id],
    );
    return response;
  } catch (err: any) {
    console.error("❌ PATCH ERROR:", err.response?.data || err.message);
    throw err;
  }
};
export { createHoursSold, getHoursSold, getUpdateSold, deleteHoursSold };
