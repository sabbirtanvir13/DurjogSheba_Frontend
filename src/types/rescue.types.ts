export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RescueStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "CANCELLED";

export interface IRescueRequest {
  id: string;
  shelterId?: string | null;
  location: string;
  contactPhone: string;
  peopleCount: number;
  urgency: UrgencyLevel;
  status: RescueStatus;
  assignedToId?: string | null;
  description?: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  shelter?: {
    id: string;
    name: string;
    district?: string;
    upazila?: string;
  } | null;
  assignedTo?: {
    id: string;
    name: string;
    phoneNumber?: string | null;
    email?: string;
  } | null;
}

export interface ICreateRescueRequestInput {
  location: string;
  contactPhone: string;
  peopleCount: number;
  urgency?: UrgencyLevel;
  description?: string;
  shelterId?: string;
}

export interface IRescueRequestFilterRequest {
  searchTerm?: string;
  shelterId?: string;
  assignedToId?: string;
  urgency?: UrgencyLevel | string;
  status?: RescueStatus | string;
}

export interface IRescueApiResponse<T = IRescueRequest[]> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
