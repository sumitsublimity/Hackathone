import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import { BudgetRecord } from "@/utils/interface";

const enquiryHead = async () => {
  const body = {
    searchFilters: [],
    sortRules: [],
  };

  const response = await axiosInstance.post(UrlConfig.POST_ENQUIRY_HEAD, body);
  return response;
};

const addEditBudget = async (body: BudgetRecord) => {
  const response = await axiosInstance.post(UrlConfig.UPDATE_BUDGET, body);
  return response;
};

const getBudget = async (params: { year?: string; siteID?: string }) => {
  const response = await axiosInstance.get(UrlConfig.GET_BUDGET, {
    params,
  });
  return response;
}

const importBudgetCsv = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(UrlConfig.IMPORT_BUDGET_CSV, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export { enquiryHead, getBudget, addEditBudget, importBudgetCsv };
