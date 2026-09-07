import { z } from "zod";
import { config } from "dotenv";

config({
  path:
    process.env.NODE_ENV === "development" ? ".env.local" : ".env.production",
});

const awsEnvSchema = z.object({
  AWS_REGION: z.string(),
  AWS_S3_ACCESS_KEY: z.string(),
  AWS_S3_SECRET_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),
});

export const awsEnv = awsEnvSchema.parse({
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
});
