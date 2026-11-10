export interface IVolunteerStats {
  totalAssigned: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface IVolunteerStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IVolunteerStats;
}

