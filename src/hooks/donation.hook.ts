import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDonationsAdmin, getMyDonations, initiateDonation } from "@/api";
import type { IInitiateDonationPayload } from "@/types";

export function useGetMyDonations() {
  return useQuery({
    queryKey: ["my-donations"],
    queryFn: () => getMyDonations(),
  });
}

export function useGetAllDonationsAdmin() {
  return useQuery({
    queryKey: ["admin-donations"],
    queryFn: () => getAllDonationsAdmin(),
  });
}

export function useInitiateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IInitiateDonationPayload) =>
      initiateDonation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-donations"] });
    },
  });
}
