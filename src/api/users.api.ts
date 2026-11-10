import { apiClient } from "@/lib/apiClient";
import type { IUserApiResponse, IUserFilterRequest, UserStatus } from "@/types";

export function getAllUsers(params?: IUserFilterRequest) {
  return apiClient<IUserApiResponse>("/admin/users", {
    method: "GET",
    query: params,
  });
}

export function updateUserStatus(id: string, status: UserStatus) {
  return apiClient<IUserApiResponse>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
