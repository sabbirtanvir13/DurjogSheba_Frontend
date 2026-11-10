import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "@/api";

export function useGetAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => getAdminDashboardStats(),
  });
}
