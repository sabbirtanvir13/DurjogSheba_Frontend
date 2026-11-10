import type { UrgencyLevel } from "./rescue.types";

export type ReliefStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "FULFILLED"
  | "CANCELLED";

export type Unit = "KG" | "LITER" | "PACKET" | "PIECE" | "BOX";

export interface IReliefNeed {
  id: string;
  shelterId: string;
  itemCategory: string;
  itemName: string;
  quantity: number;
  fulfilled: number;
  unit: Unit;
  urgency: UrgencyLevel;
  status: ReliefStatus;
  createdAt: string;
  updatedAt: string;
  shelter?: {
    id: string;
    name: string;
    district?: string;
    upazila?: string;
    contactPerson?: string;
    contactPhone?: string;
  } | null;
}

export interface ICreateReliefNeedInput {
  shelterId: string;
  itemCategory: string;
  itemName: string;
  quantity: number;
  fulfilled?: number;
  unit?: Unit;
  urgency?: UrgencyLevel;
  status?: ReliefStatus;
}

export interface IUpdateReliefNeedInput {
  itemCategory?: string;
  itemName?: string;
  quantity?: number;
  fulfilled?: number;
  unit?: Unit;
  urgency?: UrgencyLevel;
  status?: ReliefStatus;
}

export interface IReliefNeedFilterRequest {
  searchTerm?: string;
  shelterId?: string;
  itemCategory?: string;
  urgency?: UrgencyLevel | string;
  status?: ReliefStatus | string;
}

export interface IReliefNeedApiResponse<T = IReliefNeed[]> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
