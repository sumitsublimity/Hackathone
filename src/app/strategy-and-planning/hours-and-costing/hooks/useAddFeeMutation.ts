import { useMutation } from "@tanstack/react-query";
import {
  addFee,
  AddFeePayload,
} from "@/services/api/strategyAndPlanning/hoursAndCosting";

export const useAddFee = () => {
  return useMutation({
    mutationFn: (payload: AddFeePayload) => addFee(payload),
  });
};
