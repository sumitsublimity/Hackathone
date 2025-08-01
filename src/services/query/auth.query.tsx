"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "../../lib/schemas/loginSchema";
import { getUserDetails, login } from "../api/auth";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { decodeToken } from "@/utils/decodeToken";

type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const res = await login(credentials); // ensure this returns a promise
      return res.data;
    },
    mutationKey: ["AUTH"],
    onSuccess: (data) => {
      showToast(MESSAGES.SUCCESS_LOGIN, ALERT_TYPES.SUCCESS);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      const decodedToken = decodeToken(data.access_token);
      if (decodedToken) {
        const userId = decodedToken.uid;

        try {
          fetchAndSaveUserDetails(userId);
        } catch (error) {
          showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
          console.error("Error while fetching user details", error);
        }
      }
      router.push("/dashboard");
    },
    onError: (error) => {
      // showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
      console.error("Login error:", error);
    },
  });

  async function fetchAndSaveUserDetails(userId: string) {
    const userDetailsResponse = await getUserDetails(userId);
    const userDetailsPacket = await userDetailsResponse.data.responsePacket;

    // If below keys don't exist:
    if (
      !userDetailsPacket?.username &&
      !userDetailsPacket?.name &&
      !userDetailsPacket?.userRoles[0]?.role?.name
    ) {
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    } else {
      // Save userEmail:
      localStorage.setItem("userEmail", userDetailsPacket?.username);
      // Save user's name:
      localStorage.setItem("userName", userDetailsPacket?.name);
      // Save userRole:
      localStorage.setItem(
        "userRole",
        userDetailsPacket?.userRoles[0]?.role?.name,
      );
      // Redirect to dashboard
      router.push("/dashboard");
    }
  }
}
