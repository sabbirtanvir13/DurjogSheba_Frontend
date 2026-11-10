import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignVolunteerToRescue,
  createRescueRequest,
  deleteRescueRequest,
  getAllRescueRequests,
  getRescueRequestById,
  updateRescueRequestStatus,
} from "@/api";
import type {
  ICreateRescueRequestInput,
  IRescueRequestFilterRequest,
  RescueStatus,
} from "@/types";

export function useGetRescueRequests(params?: IRescueRequestFilterRequest) {
  return useQuery({
    queryKey: ["rescue-requests", params],
    queryFn: () => getAllRescueRequests(params),
  });
}

export function useGetRescueRequestById(id: string) {
  return useQuery({
    queryKey: ["rescue-requests", id],
    queryFn: () => getRescueRequestById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRescueRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateRescueRequestInput) =>
      createRescueRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
    },
  });
}

export function useAssignVolunteerToRescue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedToId }: { id: string; assignedToId: string }) =>
      assignVolunteerToRescue(id, assignedToId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateRescueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RescueStatus }) =>
      updateRescueRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
    },
  });
}

export function useDeleteRescueRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRescueRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rescue-requests"] });
    },
  });
}
