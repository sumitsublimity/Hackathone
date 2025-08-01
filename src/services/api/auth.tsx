import { loginSchema } from "@/lib/schemas/loginSchema";
import axiosInstance from "../axiosInstance";
import { z } from "zod";
import { UrlConfig } from "../ApiEndPoints";
import { UpdatePasswordPayload } from "@/utils/interface";

type LoginFormData = z.infer<typeof loginSchema>;
const login = async (formData: LoginFormData) => {
  const body = new URLSearchParams({
    grant_type: "password",
    username: formData.username.toLowerCase(),
    password: formData.password,
    client_id: formData.client_id,
    scope: formData.scope,
  });

  const response = await axiosInstance.post(UrlConfig.LOGIN_URL, body);
  return response;
};

export { login };

export async function updatePassword(payload: UpdatePasswordPayload) {
  const res = await axiosInstance.post(UrlConfig.UPDATE_PASSWORD_URL, payload);
  return res;
}

export async function getUserDetails(userId: string | null) {
  const res = await axiosInstance.get(`${UrlConfig.GET_USER_DETAIL}${userId}`);
  return res;
}
