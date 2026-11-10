import { apiClient } from "@/lib/apiClient";
import type {
  IShelterApiResponse,
  IShelterCreateInput,
  IShelterFilterRequest,
} from "@/types";

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

export function createShelter(payload: FormData | IShelterCreateInput) {
  return apiClient<IShelterApiResponse>("/shelters/create-shelter", {
    method: "POST",
    body: payload,
  });
}

export function deleteShelter(id: string) {
  return apiClient<IShelterApiResponse>(`/shelters/${id}`, {
    method: "DELETE",
  });
}
