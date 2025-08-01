import { showToast } from "@/utils/alert";
import { ALERT_TYPES } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GenericQueryPayload,
  GetKPIDashboardParams,
  KPIDashboardPayload,
} from "@/utils/interface";
import {
  addEditKPIDashboard,
  getKPIDashboardData,
  getKPIDashboardEditableData,
} from "@/services/api/kpi-dashboard/kpi-dashboard";

export function useUpdateKPIDashboard(
  successMessage: string,
  onSuccessCallback?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: KPIDashboardPayload) => {
      const response = await addEditKPIDashboard(payload);
      return response.data.responsePacket;
    },
    mutationKey: ["UPDATE_KPI_DASHBOARD"],

    onSuccess: () => {
      showToast(successMessage, ALERT_TYPES.SUCCESS);
      onSuccessCallback?.();

      // Refetch KPI Dashboard data when new data is submitted
      queryClient.invalidateQueries({
        queryKey: ["GET_KPI_DASHBOARD_DATA"],
      });
    },
    onError: (error) => {
      console.error("Error while mutating KPI Dashboard", error);
    },
  });
}

export function useGetKPIDashboardEditableData(
  payload: GenericQueryPayload,
  enabled = true,
) {
  return useQuery({
    queryKey: ["GET_KPI_DASHBOARD_EDITABLE_DATA", payload],
    queryFn: () => getKPIDashboardEditableData(payload),
    enabled,
    retry: false,
  });
}

export function useGetKPIDashboardData(
  payload: GetKPIDashboardParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["GET_KPI_DASHBOARD_DATA", payload],
    queryFn: () => getKPIDashboardData(payload),
    enabled,
    retry: false,
  });
}
