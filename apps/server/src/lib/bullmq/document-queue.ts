import { serverEnv } from "@repo/env/serverEnv";
import { Queue } from "bullmq";

export const DocumentQueue = new Queue("document-queue", {
  connection: {
    url: serverEnv.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
  },
});
