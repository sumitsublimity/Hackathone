"use client";
import {
  createHoursSold,
  deleteHoursSold,
  getHoursSold,
  getUpdateSold,
} from "@/services/api/hours-sold/hours.sold.api";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
// type LoginFormData = z.infer<typeof loginSchema>;

export function useCreateHoursSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await createHoursSold(data); // ensure this returns a promise
      return res.data;
    },
    mutationKey: ["CREATE_HOURS_SOLD"],
    onSuccess: (data) => {
      showToast(MESSAGES.HOURS_SOLD_CREATE, ALERT_TYPES.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["GET_HOURS_SOLD"] });
    },
    onError: (error) => {
      console.error("CREATE_HOURS_SOLD:", error);
    },
  });
}

export function useUpdateHoursSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await getUpdateSold(id, payload); // Ensure this is implemented correctly
      return res.data;
    },
    mutationKey: ["UPDATE_HOURS_SOLD"],
    onSuccess: (data) => {
      showToast(MESSAGES.HOURS_SOLD_CREATE, ALERT_TYPES.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["GET_HOURS_SOLD"] });
    },
    onError: (error) => {
      console.error("UPDATE_HOURS_SOLD:", error);
    },
  });
}
export function useDeleteHoursSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await deleteHoursSold(id); // Ensure this is implemented correctly
      return res.data;
    },
    mutationKey: ["DELETE_HOURS_SOLD"],
    onSuccess: (data) => {
      showToast(MESSAGES.HOURS_SOLD_DELETE, ALERT_TYPES.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["GET_HOURS_SOLD"] });
    },
    onError: (error) => {
      console.error("UPDATE_HOURS_SOLD:", error);
    },
  });
}

export function useGetHoursSold(
  siteID?: string,
  month?: string,
  year?: string,
) {
  return useQuery({
    queryKey: ["GET_HOURS_SOLD", year, siteID, month],
    queryFn: async () => {
      const params = { year, month, siteID };
      const res = await getHoursSold(params);
      return res.data.responsePacket;
    },
    enabled: !!year && !!siteID && !!month, // ✅ only run when both are defined
  });
}
