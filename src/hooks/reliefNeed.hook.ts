import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReliefNeed,
  deleteReliefNeed,
  getAllReliefNeeds,
  getReliefNeedById,
  updateReliefNeed,
} from "@/api";
import type {
  ICreateReliefNeedInput,
  IReliefNeedFilterRequest,
  IUpdateReliefNeedInput,
} from "@/types";

export function useGetReliefNeeds(params?: IReliefNeedFilterRequest) {
  return useQuery({
    queryKey: ["relief-needs", params],
    queryFn: () => getAllReliefNeeds(params),
  });
}

export function useGetReliefNeedById(id: string) {
  return useQuery({
    queryKey: ["relief-needs", id],
    queryFn: () => getReliefNeedById(id),
    enabled: Boolean(id),
  });
}

export function useCreateReliefNeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateReliefNeedInput) => createReliefNeed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relief-needs"] });
    },
  });
}

export function useUpdateReliefNeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateReliefNeedInput;
    }) => updateReliefNeed(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relief-needs"] });
    },
  });
}

export function useDeleteReliefNeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReliefNeed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relief-needs"] });
    },
  });
}
