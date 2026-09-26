import { serverEnv } from "@repo/env/serverEnv";
import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: [serverEnv.NEXT_PUBLIC_FRONTEND_URL],
  credentials: true,
};
