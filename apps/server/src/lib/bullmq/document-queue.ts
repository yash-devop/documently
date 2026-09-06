import { Queue } from "bullmq";
import { serverEnv } from "../zod/env";

export const DocumentQueue = new Queue("document-queue", {
  connection: {
    url: serverEnv.REDIS_URL,
  },
});
