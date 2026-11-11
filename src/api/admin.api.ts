import { apiClient } from "@/lib/apiClient";
import type { IAdminDashboardStatsResponse } from "@/types";

export function getAdminDashboardStats() {
  return apiClient<IAdminDashboardStatsResponse>("/admin/dashboard-stats", {
    method: "GET",
  });
}

