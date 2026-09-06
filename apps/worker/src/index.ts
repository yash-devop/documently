import { Job, Worker } from "bullmq";
import { redisClient } from "./lib/redis";
import { workerEnv } from "@repo/env/workerEnv";
console.log("REDIS SERVER ENVS", workerEnv);
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log("YES CONNECTED");
//   } catch (err) {
//     console.error("Failed to connect to Redis:", err);
//     process.exit(1);
//   }
// })();
const documentWorker = new Worker(
  "document-queue",
  async (job: Job) => {
    const { documentId } = JSON.parse(job.data) as {
      documentId: string;
    };

    console.log("PARSED Document Id => ", documentId);
  },
  {
    connection: redisClient,
  },
);

documentWorker.on("ready", () => {
  console.log("Worker is IDLE");
});

documentWorker.on("completed", () => {
  console.log("Document Worker completed.. Going IDLE .");
});
