import { apiClient } from "@/lib/apiClient";
import type {
  ICreateRescueRequestInput,
  IRescueApiResponse,
  IRescueRequest,
  IRescueRequestFilterRequest,
  RescueStatus,
} from "@/types";

export function getAllRescueRequests(params?: IRescueRequestFilterRequest) {
  return apiClient<IRescueApiResponse<IRescueRequest[]>>("/rescue-requests", {
    method: "GET",
    query: params,
  });
}

export function getRescueRequestById(id: string) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/rescue-requests/${id}`,
    {
      method: "GET",
    },
  );
}

export function createRescueRequest(payload: ICreateRescueRequestInput) {
  return apiClient<IRescueApiResponse<IRescueRequest>>("/rescue-requests", {
    method: "POST",
    body: payload,
  });
}

export function assignVolunteerToRescue(id: string, assignedToId: string) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/rescue-requests/${id}/assign`,
    {
      method: "PATCH",
      body: { assignedToId },
    },
  );
}

export function updateRescueRequestStatus(id: string, status: RescueStatus) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/rescue-requests/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export function deleteRescueRequest(id: string) {
  return apiClient<IRescueApiResponse<IRescueRequest>>(
    `/rescue-requests/${id}`,
    {
      method: "DELETE",
    },
  );
}
