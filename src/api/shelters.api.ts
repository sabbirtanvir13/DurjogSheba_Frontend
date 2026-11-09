import { apiClient } from "@/lib/apiClient";
import type { IShelterApiResponse, IShelterFilterRequest } from "@/types";

export function getAllShelters(params?: IShelterFilterRequest) {
  return apiClient<IShelterApiResponse>("/shelters", {
    method: "GET",
    query: params,
  });
}

export function getShelterById(id: string) {
  return apiClient<IShelterApiResponse>(`/shelters/${id}`, {
    method: "GET",
  });
}
