import { TEditExpense } from "@/app/strategy-and-planning/sp-data/page";
import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";

const getSPExpense = async (params: { year?: string; siteID?: string }) => {
  const response = await axiosInstance.get(UrlConfig.GET_SP_EXPENSE, {
    params,
  });
  return response;
};
const getSP = async (params: { year?: string; siteID?: string }) => {
  const response = await axiosInstance.get(UrlConfig.GET_SP, {
    params,
  });
  return response;
};
const addEditSPExpense = async ({...body}: TEditExpense) => {
  const response = await axiosInstance.post(UrlConfig.GET_SP_EXPENSE_UPDATE, {...body});
  return response;
};
const addEditSP = async ({...body}: any) => {
  const response = await axiosInstance.post(UrlConfig.POST_SP, {...body});
  return response;
};

export { getSPExpense ,addEditSPExpense,addEditSP,getSP};
