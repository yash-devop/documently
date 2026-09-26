import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.url(),
  NEXT_PUBLIC_FRONTEND_URL: z.url(),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
});
