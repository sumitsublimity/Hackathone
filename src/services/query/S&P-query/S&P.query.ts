"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addEditSP, addEditSPExpense, getSP, getSPExpense } from "@/services/api/S&P/S&P.api";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { TEditExpense } from "@/app/strategy-and-planning/sp-data/page";
import { UpdateSPRequest } from "@/utils/interface";

export const useGetSPExpense = (year: string, siteID: string) => {
  return useQuery({
    queryKey: ["GET_EXPENSE", year, siteID],
    queryFn: async () => {
      const params = { year, ...(siteID && { siteID }) };
      const res = await getSPExpense(params);
      return res.data.responsePacket;
    },
    enabled: !!year && !!siteID, // ✅ only run when both are defined
  });
};
export const useGetSP = (year: string, siteID: string) => {
  return useQuery({
    queryKey: ["GET_SP", year, siteID],
    queryFn: async () => {
      const params = { year, ...(siteID && { siteID }) };
      const res = await getSP(params);
      return res.data.data;
    },
    enabled: !!year && !!siteID, // ✅ only run when both are defined
  });
};
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TEditExpense) => {
      const response = await addEditSPExpense(payload); // your post API call
      return response.data.responsePacket;
    },
    mutationKey: ["EXPENSE_UPDATE"],

    onSuccess: () => {
      showToast(MESSAGES.EXPENSE_UPDATE, ALERT_TYPES.SUCCESS);

      // Invalidate the GET query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["GET_EXPENSE"] });
    },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("UPDATE_BUDGET_ERROR", error);
    },
  });
}


export function useUpdateSP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSPRequest) => {
      const response = await addEditSP(payload); // your post API call
      return response.data.responsePacket;
    },
    mutationKey: ["SP_UPDATE"],

    onSuccess: () => {
      showToast(MESSAGES.SP_UPDATE, ALERT_TYPES.SUCCESS);

      // Invalidate the GET query to refresh the table
      queryClient.invalidateQueries({ queryKey: ["GET_SP"] });
    },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("GET_SP_ERROR", error);
    },
  });
}