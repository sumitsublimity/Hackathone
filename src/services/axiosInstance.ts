import axios from "axios";
import { ALERT_TYPES, API_BASE_URL, MESSAGES } from "@/utils/constants";
import { showToast } from "@/utils/alert";
import { UrlConfig } from "./ApiEndPoints";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // Cancel the request and show toast if user is offline
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast(MESSAGES.OFFLINE_ERROR, ALERT_TYPES.ERROR);

      return Promise.reject({
        message: MESSAGES.OFFLINE,
        config,
        isOffline: true,
      });
    }

    const token = localStorage.getItem("access_token");

    if (config.url === UrlConfig.LOGIN_URL) {
      config.headers.Authorization =
        "Basic " + btoa("NurseryAdmin:NurseryAdmin");
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  // Cancel request in case of an error:
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  // If the API replies fine, just pass the response along:
  (response) => response,
  // Otherwise:
  (error) => {
    // Double check for offline error:
    if (error.isOffline) {
      // Already handled in request interceptor
      return Promise.reject(error);
    }

    if (!navigator.onLine) {
      showToast(MESSAGES.OFFLINE_ERROR, ALERT_TYPES.ERROR);
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    switch (status) {
      // Unauthorized:
      case 401:
        // This is applied because sometimes, we don't receive proper message from API:
        if (error.response?.data?.message) {
          showToast(error.response?.data?.message, ALERT_TYPES.ERROR);
        } else {
          showToast(MESSAGES.PERMISSION_DENIED_MESSAGE, ALERT_TYPES.ERROR);
        }
        localStorage.clear();
        if (window.location.pathname !== "/") window.location.href = "/";
        break;
      // Forbidden:
      case 403:
        showToast(MESSAGES.UNAUTHORIZED_REQUEST, ALERT_TYPES.ERROR);
        break;
      // Not Found:
      case 404:
        showToast(MESSAGES.NOT_FOUND_404, ALERT_TYPES.ERROR);
        break;
      // Internal Server Error:
      case 500:
        // This conditional check is because update-password API message is handled separately.
        if (error.config.url !== UrlConfig.UPDATE_PASSWORD_URL) {
          showToast(MESSAGES.ERROR_MESSAGE, ALERT_TYPES.ERROR);
        }
        break;
      default:
        showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
