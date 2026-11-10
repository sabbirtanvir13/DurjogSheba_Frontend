import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShelter,
  deleteShelter,
  getAllShelters,
  getShelterById,
  updateShelter,
} from "@/api/shelters.api";
import type { IShelterCreateInput, IShelterFilterRequest } from "@/types";

export function useGetShelters(params?: IShelterFilterRequest) {
  return useQuery({
    queryKey: ["shelters", params],
    queryFn: () => getAllShelters(params),
  });
}

export function useGetShelterById(id: string) {
  return useQuery({
    queryKey: ["shelter", id],
    queryFn: () => getShelterById(id),
    enabled: !!id,
  });
}

export function useCreateShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData | IShelterCreateInput) =>
      createShelter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
    },
  });
}

export function useUpdateShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<IShelterCreateInput>;
    }) => updateShelter(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
      queryClient.invalidateQueries({ queryKey: ["shelter"] });
    },
  });
}

export function useDeleteShelter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShelter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelters"] });
    },
  });
}
