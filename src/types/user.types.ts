export type UserRole = "ADMIN" | "VOLUNTEER" | "DONOR";
export type UserStatus = "ACTIVE" | "BLOCKED" | "PENDING" | "SUSPENDED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  isVerified?: boolean;
  createdAt: string;
}

export interface IUserFilterRequest {
  searchTerm?: string;
  role?: string;
  status?: string;
}

export interface IUserApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: IUser[] | IUser;
}
