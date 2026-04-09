import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiErrorResponse {
  message?: string;
}

const publicAuthPaths = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/resend-otp",
]);

const shouldRedirectToLogin = (error: AxiosError) => {
  if (error.response?.status !== 401) {
    return false;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  const requestUrl = error.config?.url || "";
  return !publicAuthPaths.has(requestUrl);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError && shouldRedirectToLogin(error)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const apiMessage =
      error instanceof AxiosError
        ? ((error.response?.data as ApiErrorResponse | undefined)?.message ??
          error.message)
        : "Something went wrong";

    const normalizedError = new Error(apiMessage);

    return Promise.reject(normalizedError);
  },
);

export default api;
