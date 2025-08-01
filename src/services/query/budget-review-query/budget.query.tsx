"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addEditBudget,
  enquiryHead,
  getBudget,
  importBudgetCsv
} from "@/services/api/budget-review/budget";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { BudgetRecord } from "@/utils/interface";

export function useEnquiryHead() {
  return useMutation({
    mutationFn: async () => {
      const res = await enquiryHead(); // ensure this returns a promise
      return res.data.responsePacket;
    },
    mutationKey: ["QUERY_HEAD"],
    onSuccess: (data) => { },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("QUERY_HEAD", error);
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BudgetRecord) => {
      const response = await addEditBudget(payload); // your post API call
      return response.data.responsePacket;
    },
    mutationKey: ["UPDATE_BUDGET"],

    onSuccess: () => {
      showToast(MESSAGES.BUDGET_UPDATE, ALERT_TYPES.SUCCESS);

      // Invalidate the GET query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["GET_BUDGET"] });
    },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("UPDATE_BUDGET_ERROR", error);
    },
  });
}

export const useGetBudget = (year: string, siteID: string) => {
  return useQuery({
    queryKey: ["GET_BUDGET", year, siteID],
    queryFn: async () => {
      const params = { year, ...(siteID && { siteID }) };
      const res = await getBudget(params);
      return res.data.responsePacket;
    },
    enabled: !!year && !!siteID, // ✅ only run when both are defined
  });
};

export const useImportBudgetCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await importBudgetCsv(file);
      return response.data.responsePacket;
    },
    onSuccess: () => {
      showToast(MESSAGES.IMPORT_BUDGET, ALERT_TYPES.SUCCESS);

      // Invalidate the GET query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["GET_BUDGET"] });
    },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("UPDATE_BUDGET_ERROR", error);
    },
  });
};

