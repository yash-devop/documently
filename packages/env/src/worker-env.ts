import { config } from "dotenv";
import { z } from "zod";

import { resolveEnvFile } from "./resolve-env-file.js";

config({ path: await resolveEnvFile() });

const workerEnvSchema = z.object({
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
});

export const workerEnv = workerEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
});
