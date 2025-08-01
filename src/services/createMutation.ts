import { useMutation, UseMutationResult } from "@tanstack/react-query";

export function createMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  onSuccess?: (data: TData) => void,
  onError?: (error: any) => void,
): UseMutationResult<TData, unknown, TVariables> {
  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
}
