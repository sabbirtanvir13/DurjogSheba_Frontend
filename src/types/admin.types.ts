export interface IAdminOverviewStats {
  totalUsers: number;
  totalShelters: number;
  totalRescueRequests: number;
  pendingRescues: number;
  totalReliefNeeds: number;
}

export interface IAdminTopAffectedLocation {
  location: string;
  _count: {
    id: number;
  };
}

export interface IAdminDashboardStats {
  overview: IAdminOverviewStats;
  topAffectedLocations: IAdminTopAffectedLocation[];
}

export interface IAdminDashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IAdminDashboardStats;
}

