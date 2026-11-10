export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IDonationDonorSummary {
  id: string;
  name: string | null;
  email: string;
  phoneNumber?: string | null;
}

export interface IDonation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  transactionId: string;
  paymentGateway: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  donor?: IDonationDonorSummary;
}

export interface IInitiateDonationPayload {
  amount: number;
  paymentGateway: string;
}

export interface IInitiateDonationResponse {
  bkashURL: string;
  paymentID: string;
  donationId: string;
}

export interface IDonationApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
}
