import { prisma } from "@repo/db";
import { downloadFromS3 } from "@repo/utils";
import { Job, Worker } from "bullmq";
import { cleanText, pdfParser } from "./lib/pdf-parse";
import { redisClient } from "./lib/redis";

const documentWorker = new Worker(
  "document-queue",
  async (job: Job) => {
    const { documentId } = JSON.parse(job.data) as {
      documentId: string;
    };
    console.log("PARSED Document Id => ", documentId);
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      console.log("DOCUMENT NOT FOUND");
      return;
    }

    try {
      const pdfBuffer = await downloadFromS3(document.storageKey);
      const parsedPdfText = await pdfParser(pdfBuffer);
      const cleanPdfText = cleanText(parsedPdfText.text);

      console.log("Parsed Data PDF ", cleanPdfText);
    } catch (error) {
      console.log("Error in  s3", error);
    }
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
