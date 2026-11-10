import { apiClient } from "@/lib/apiClient";
import type {
  IRescueApiResponse,
  IRescueRequest,
  IVolunteerStatsResponse,
  RescueStatus,
} from "@/types";

export function getVolunteerDashboardStats() {
  return apiClient<IVolunteerStatsResponse>("/volunteers/dashboard-stats", {
    method: "GET",
  });
}

export function getMyAssignedRescues() {
  return apiClient<IRescueApiResponse<IRescueRequest[]>>(
    "/volunteers/my-rescues",
    {
      method: "GET",
    },
  );
}

export function selfAssignRescue(rescueId: string) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/volunteers/rescue/${rescueId}/self-assign`,
    {
      method: "PATCH",
    },
  );
}

export function updateMyRescueStatus(rescueId: string, status: RescueStatus) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/volunteers/rescue/${rescueId}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}
