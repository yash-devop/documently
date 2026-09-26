import { serverEnv } from "@repo/env/serverEnv";
import { CorsOptions } from "cors";

export const allowedOrigins = [
  serverEnv.NEXT_PUBLIC_FRONTEND_URL,
  "http://localhost:3000",
];

export const corsConfig: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
