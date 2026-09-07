import { prisma } from "@repo/db";
import { getPresignedUrl } from "@repo/utils";
import { Job, Worker } from "bullmq";
import { redisClient } from "./lib/redis";

const documentWorker = new Worker(
  "document-queue",
  async (job: Job) => {
    const { documentId } = JSON.parse(job.data) as {
      documentId: string;
    };

    console.log("PARSED Document Id => ", documentId);

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      // doc not found.
      console.log("DOCUMENT NOT FOUND");
      return;
    }

    // get the pdf .

    try {
      const url = await getPresignedUrl(document.storageKey);

      console.log("S3 url", url);
    } catch (error) {
      console.log("Error in  s3", error);
    }

    // await prisma.document.update({
    //   data: {
    //     status: "READY",
    //   },
    //   where: {
    //     id: documentId,
    //   },
    // });
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
