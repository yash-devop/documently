import { Prisma, prisma } from "@repo/db";
import { NonRetryableError, RetryableError, getEmbeddings } from "@repo/embeddings";
import { downloadFromS3 } from "@repo/utils";
import { Job, randomUUID, Worker } from "bullmq";
import { chunkText } from "./lib/chunk";
import { cleanText, pdfParser } from "./lib/pdf-parse";
import { redisClient } from "./lib/redis";

const documentWorker = new Worker(
  "document-queue",
  async (job: Job) => {
    let documentId: string | null = null;
    try {
      const data: {
        documentId: string;
      } = job.data;

      documentId = data.documentId;
      if (!documentId) {
        throw new NonRetryableError(
          "INVALID_JOB_DATA",
          "DocumentId is missing from job data",
        );
      }
      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
        },
      });

      if (!document) {
        throw new RetryableError("DOCUMENT_NOT_FOUND", "Document not found.");
      }

      console.log("PARSED Document Id => ", documentId);
      const pdfBuffer = await downloadFromS3(document.storageKey);
      const parsedPdfText = await pdfParser(pdfBuffer);
      const cleanPdfText = cleanText(parsedPdfText.text);

      if (!cleanPdfText) {
        throw new NonRetryableError(
          "PDF_PARSE_FAILED",
          "PDF contains no readable text",
        );
      }

      const chunks = await chunkText(cleanPdfText);

      // const dbData = chunks.map((chunk, idx) => {
      //   return {
      //     chunkIndex: idx,
      //     content: chunk,
      //     documentId: documentId ?? "",
      //   };
      // });

      const embeddings: number[][] = await getEmbeddings(chunks);

      const values = chunks.map((chunk, idx) => {
        const vector = `[${embeddings[idx]?.join(",")}]`;

        return Prisma.Prisma.sql`(
    ${randomUUID()},
    ${documentId},
    ${chunk},
    ${idx},
    NOW(),
    NOW(),
    ${vector}::vector
  )`;
      });

      await prisma.$executeRaw`
  INSERT INTO "document_chunk"
    ("id", "documentId", "content", "chunkIndex", "createdAt", "updatedAt", "embedding")
  VALUES ${Prisma.Prisma.join(values, ",")}
`;
      console.log("values", values);
      console.log("length", embeddings.length);

      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "READY",
        },
      });
    } catch (error) {
      console.error(`Document processing failed: ${documentId}`, error);
      if (!documentId) {
        throw error;
      }
      if (error instanceof NonRetryableError) {
        await prisma.document.update({
          where: {
            id: documentId,
          },
          data: {
            status: "FAILED",
            errorCode: error.code,
            errorMessage: error.message,
          },
        });
        return; // skipping the retries.
      }
      await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          status: "PROCESSING",
          errorCode:
            error instanceof RetryableError
              ? error.code
              : "SOMETHING_WENT_WRONG",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
      throw error; // throwing error will allow bullmq to retry that same job
    }
  },
  {
    connection: redisClient,
    concurrency: 3,
  },
);

documentWorker.on("ready", () => {
  console.log("Worker is IDLE");
});

documentWorker.on("completed", () => {
  console.log("Document Worker completed.. Going IDLE .");
});

documentWorker.on("failed", async (job, error) => {
  console.log(
    `Document Worker failed for ${job?.data.documentId ? `Document ID : ${job?.data.documentId}` : " "} job ${job?.id ?? "unknown"}:`,
    error.message,
  );

  const attempts = job?.opts.attempts ?? 1;
  const attemptsMade = job?.attemptsMade ?? 0;

  const attemptsExhausted = attemptsMade >= attempts;

  if (!attemptsExhausted) {
    return;
  }

  const documentId = job?.data.documentId;
  if (!documentId) {
    return;
  }

  await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      status: "FAILED",
      errorCode:
        error instanceof RetryableError || error instanceof NonRetryableError
          ? error.code
          : "SOMETHING_WENT_WRONG",
      errorMessage: error.message,
    },
  });
});
