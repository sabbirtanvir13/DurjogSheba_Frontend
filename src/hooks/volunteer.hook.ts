import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyAssignedRescues,
  getVolunteerDashboardStats,
  selfAssignRescue,
  updateMyRescueStatus,
} from "@/api";
import type { RescueStatus } from "@/types";

export function useGetVolunteerStats() {
  return useQuery({
    queryKey: ["volunteer-stats"],
    queryFn: () => getVolunteerDashboardStats(),
  });
}

export function useGetMyAssignedRescues() {
  return useQuery({
    queryKey: ["my-rescues"],
    queryFn: () => getMyAssignedRescues(),
  });
}

export function useSelfAssignRescue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rescueId: string) => selfAssignRescue(rescueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rescues"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
    },
  });
}

export function useUpdateMyRescueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rescueId,
      status,
    }: {
      rescueId: string;
      status: RescueStatus;
    }) => updateMyRescueStatus(rescueId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rescues"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
    },
  });
}
