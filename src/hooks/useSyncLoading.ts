import { useLoading } from "@/app/LoadingContext";
import { useEffect } from "react";

/**
 * Syncs multiple loading flags with global isLoading state.
 * Automatically sets `isLoading` to true if any of the flags are true.
 */
export function useSyncLoading(...flags: boolean[]) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const isBusy = flags.some(Boolean);
    setIsLoading(isBusy);
  }, [...flags]); // Spread array so individual flags are tracked
}
