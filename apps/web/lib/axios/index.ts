import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export interface ApiError {
  message: string;
  status?: number;
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      (status === 401 ? "You are not authorized" : "Something went wrong");
    return { message, status };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong" };
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    console.log("EROR", error);

    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out");
    } else if (error.response) {
      const data = error.response.data as ApiError;
      toast.error(data.message ?? "Something went wrong");
    } else if (error.request) {
      toast.error("Network error. Please try again.");
    } else {
      toast.error(error.message || "Something went wrong");
    }
    return Promise.reject(error);
  },
);
