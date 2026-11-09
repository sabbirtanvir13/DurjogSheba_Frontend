export interface IReliefNeedItem {
  id?: string;
  shelterId?: string;
  name?: string;
  itemName?: string;
  itemCategory?: string;
  quantity?: string | number;
  fulfilled?: number;
  unit?: string;
  urgency?:
    | "CRITICAL"
    | "HIGH"
    | "MEDIUM"
    | "LOW"
    | "IN PROGRESS"
    | "IN_PROGRESS"
    | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRescueRequestItem {
  id?: string;
  shelterId?: string;
  location?: string;
  contactPhone?: string;
  peopleCount?: number;
  urgency?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  status?: string;
  assignedToId?: string;
  description?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShelter {
  _id?: string;
  id?: string | number;
  name: string;
  district: string;
  upazila: string;
  address: string;
  capacity: number;
  currentPeople?: number;
  contactPerson?: string;
  contactPhone: string;
  coordinatorId?: string;
  coordinator?:
    | {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        phoneNumber?: string;
      }
    | string;
  images?: string[];
  reliefNeeds?: IReliefNeedItem[];
  rescueRequests?: IRescueRequestItem[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShelterCreateInput {
  name: string;
  district: string;
  upazila: string;
  address: string;
  capacity: number;
  currentPeople?: number;
  contactPerson: string;
  contactPhone: string;
  coordinatorId?: string;
  images?: string[];
}

export interface IShelterFilterRequest {
  searchTerm?: string;
  district?: string;
  upazila?: string;
}

export interface IShelterApiResponse {
  success?: boolean;
  message?: string;
  data?: IShelter[] | IShelter;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
