import { apiClient } from "@/lib/apiClient";
import type { LoginFormData, RegisterPayload } from "@/validation";

export function Userlogin(payload: LoginFormData) {
  return apiClient<any>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function UserRegister(payload: RegisterPayload) {
  return apiClient<any>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function UserLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  if (typeof window !== "undefined" && !localStorage.getItem("accessToken")) {
    return null;
  }

  try {
    const res = await apiClient<any>("/auth/me");
    return res?.data ?? null;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    return null;
  }
}

export function googleAuth(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}
