import { config } from "dotenv";
import { z } from "zod";

config({
  path:
    process.env.NODE_ENV === "development" ? ".env.local" : ".env.production",
});

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});
