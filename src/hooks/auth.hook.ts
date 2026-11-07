import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  googleAuth,
  UserLogout,
  Userlogin,
  UserRegister,
  verifyAccount,
} from "@/api";
import type { AuthApiResponse } from "@/types";

function extractToken(res: AuthApiResponse): string | undefined {
  const dataObj = res?.data as Record<string, unknown> | undefined;
  const resObj = res as Record<string, unknown>;
  return (
    (dataObj?.accessToken as string) ||
    (resObj?.accessToken as string) ||
    (dataObj?.token as string) ||
    (resObj?.token as string)
  );
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Userlogin,
    onSuccess: (res: AuthApiResponse) => {
      const token = extractToken(res);
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserRegister,
    onSuccess: (res: AuthApiResponse) => {
      const token = extractToken(res);
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useVerifyAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAccount,
    onSuccess: (res: AuthApiResponse) => {
      const token = extractToken(res);
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
    onSuccess: (res: AuthApiResponse) => {
      const token = extractToken(res);
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
