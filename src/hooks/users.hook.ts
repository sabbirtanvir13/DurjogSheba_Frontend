import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserStatus } from "@/api/users.api";
import type { IUserFilterRequest, UserStatus } from "@/types";

export function useGetUsers(params?: IUserFilterRequest) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
