import axios, { AxiosError } from "axios";
import { toast } from "@/components/toasts/index";

const API_VERSION = "/api/v1";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_VERSION}`,
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
    const data = error.response?.data as
      | { message?: string; error?: { message?: string } }
      | undefined;
    const message =
      data?.error?.message ??
      data?.message ??
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
      toast({ title: "Request timed out", type: "error" });
    } else if (error.response) {
      const data = error.response.data as {
        message?: string;
        error?: { message?: string };
      };
      toast({
        title:
          data?.error?.message ?? data?.message ?? "Something went wrong",
        type: "error",
      });
    } else if (error.request) {
      toast({ title: "Network error. Please try again.", type: "error" });
    } else {
      toast({ title: error.message || "Something went wrong", type: "error" });
    }
    return Promise.reject(error);
  },
);
