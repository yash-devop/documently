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

  FRONTEND_URL: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_API_KEY: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_API_KEY: z.string(),

  AWS_REGION: z.string(),
  AWS_S3_ACCESS_KEY: z.string(),
  AWS_S3_SECRET_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),

  REDIS_URL: z.url(),
});

export const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

  FRONTEND_URL: process.env.FRONTEND_URL,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_API_KEY: process.env.GITHUB_API_KEY,

  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  REDIS_URL: process.env.REDIS_URL,
});
