import { useQuery } from "@tanstack/react-query";
import { getAllShelters, getShelterById } from "@/api/shelters.api";
import type { IShelterFilterRequest } from "@/types";

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

