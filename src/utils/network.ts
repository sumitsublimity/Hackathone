import { showToast } from "./alert";
import { ALERT_TYPES, MESSAGES } from "./constants";

export function checkNetwork() {
  if (typeof window !== "undefined" && !navigator.onLine) {
    showToast(MESSAGES.OFFLINE_ERROR, ALERT_TYPES.ERROR);
    throw new Error("No internet connection");
  }
}
