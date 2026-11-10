import { apiClient } from "@/lib/apiClient";
import type {
  IDonation,
  IDonationApiResponse,
  IInitiateDonationPayload,
  IInitiateDonationResponse,
} from "@/types";

export function initiateDonation(payload: IInitiateDonationPayload) {
  return apiClient<IDonationApiResponse<IInitiateDonationResponse>>(
    "/donations",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getMyDonations() {
  return apiClient<IDonationApiResponse<IDonation[]>>("/donor/my-donations", {
    method: "GET",
  });
}

export function getAllDonationsAdmin() {
  return apiClient<IDonationApiResponse<IDonation[]>>("/admin/all-donations", {
    method: "GET",
  });
}

