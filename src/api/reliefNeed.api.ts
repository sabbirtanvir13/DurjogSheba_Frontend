import { apiClient } from "@/lib/apiClient";
import type {
  ICreateReliefNeedInput,
  IReliefNeed,
  IReliefNeedApiResponse,
  IReliefNeedFilterRequest,
  IUpdateReliefNeedInput,
} from "@/types";

export function getAllReliefNeeds(params?: IReliefNeedFilterRequest) {
  return apiClient<IReliefNeedApiResponse<IReliefNeed[]>>("/relief-needs", {
    method: "GET",
    query: params,
  });
}

export function getReliefNeedById(id: string) {
  return apiClient<IReliefNeedApiResponse<IReliefNeed>>(`/relief-needs/${id}`, {
    method: "GET",
  });
}

export function createReliefNeed(payload: ICreateReliefNeedInput) {
  return apiClient<IReliefNeedApiResponse<IReliefNeed>>("/relief-needs", {
    method: "POST",
    body: payload,
  });
}

export function updateReliefNeed(id: string, payload: IUpdateReliefNeedInput) {
  return apiClient<IReliefNeedApiResponse<IReliefNeed>>(`/relief-needs/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteReliefNeed(id: string) {
  return apiClient<IReliefNeedApiResponse<IReliefNeed>>(`/relief-needs/${id}`, {
    method: "DELETE",
  });
}
