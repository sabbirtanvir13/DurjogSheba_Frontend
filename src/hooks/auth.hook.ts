import { getMe, googleAuth, Userlogin, UserLogout } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Userlogin,
    onSuccess: (res: any) => {
      const token = res?.data?.accessToken;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserLogout,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}


export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleAuth,
    onSuccess: (res: any) => {
      const token = res?.data?.accessToken;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}