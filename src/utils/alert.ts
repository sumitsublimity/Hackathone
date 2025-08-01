import { toast } from "sonner";

const shownToasts = new Set<string>();
const DEFAULT_DURATION = 3000;

export function showToast(message: string, type: string) {
  const toastKey = `${type}:${message}`;

  if (shownToasts.has(toastKey)) return;

  shownToasts.add(toastKey);

  toast(message, {
    id: toastKey,
    style:
      type === "error"
        ? { backgroundColor: "#f87171", color: "white" }
        : { backgroundColor: "#34a853", color: "white" },
    duration: DEFAULT_DURATION,
  });

  setTimeout(() => {
    shownToasts.delete(toastKey);
  }, DEFAULT_DURATION);
}
