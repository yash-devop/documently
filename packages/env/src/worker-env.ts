import { config } from "dotenv";
import { z } from "zod";

config({
  path:
    process.env.NODE_ENV === "development" ? ".env.local" : ".env.production",
});

const workerEnvSchema = z.object({
  // NODE_ENV: z.enum(["development", "production"]).default("development"),

  // DATABASE_URL: z.url(),

  // AWS_REGION: z.string(),
  // AWS_S3_ACCESS_KEY: z.string(),
  // AWS_S3_SECRET_KEY: z.string(),
  // AWS_S3_BUCKET: z.string(),

  REDIS_URL: z.url(),
});

export const workerEnv = workerEnvSchema.parse({
  // NODE_ENV: process.env.NODE_ENV,
  // DATABASE_URL: process.env.DATABASE_URL,

  // AWS_REGION: process.env.AWS_REGION,
  // AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  // AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  // AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  REDIS_URL: process.env.REDIS_URL,
});
