import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  AuthResponse,
  RegisterOtpResponse,
  User,
  VerifyOtpResponse,
} from "@/lib/types";
import { useAuthStore } from "@/store/authStore";

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthPayload {
  name: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface ResendOtpPayload {
  email: string;
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export const useAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const login = useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      const { token, ...user } = data;
      setAuth({ user, token });
    },
  });

  const register = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<RegisterOtpResponse>(
        "/auth/register",
        payload,
      );
      return data;
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const { data } = await api.post<VerifyOtpResponse>(
        "/auth/verify-otp",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      setAuth({ user: data.user, token: data.token });
    },
  });

  const resendOtp = useMutation({
    mutationFn: async (payload: ResendOtpPayload) => {
      const { data } = await api.post<RegisterOtpResponse>(
        "/auth/resend-otp",
        payload,
      );
      return data;
    },
  });

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/me");
      return data;
    },
    enabled: !!useAuthStore.getState().token,
  });

  const updateMe = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.put<User>("/auth/me", payload);
      return data;
    },
    onSuccess: (user) => {
      const token = useAuthStore.getState().token;
      if (token) {
        setAuth({ user, token });
      }
    },
  });

  return {
    login,
    register,
    verifyOtp,
    resendOtp,
    me,
    updateMe,
    logout: clearAuth,
  };
};
