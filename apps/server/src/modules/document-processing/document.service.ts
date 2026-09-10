import { User } from "better-auth";
import { randomUUID } from "crypto";
import { DocumentQueue } from "../../lib/bullmq/document-queue";
import { prisma, Prisma } from "@repo/db";
import { uploadToS3 } from "@repo/utils";
import { AppError } from "../../middlewares/error.middleware";

export const DocumentService = {
  uploadDocuments: async (files: Express.Multer.File[], user: User) => {
    if (files.length === 0) return;

    const userId = user.id;

    const res = await Promise.all(
      files.map(async (file) => {
        let documentCreated = false;
        const documentId = randomUUID();
        const storageKey = `users/${userId}/${documentId}.pdf`;

        try {
          const document = await prisma.document.create({
            data: {
              id: documentId,
              userId,
              originalName: file.originalname,
              storageKey,
              mimeType: file.mimetype,
              size: file.size,
            },
          });

          documentCreated = true;

          // await uploadToS3({
          //   key: storageKey,
          //   body: file.buffer,
          //   contentType: file.mimetype,
          // });

          await DocumentQueue.add(
            "process-document",
            JSON.stringify({
              documentId: "a20c8eb0-126e-4422-b520-af05d079835e",
            }),
          );

          return {
            id: documentId,
            originalName: file.originalname,
            status: document.status as Prisma.DOCUMENT_STATUS,
          };
        } catch (error) {
          if (documentCreated) {
            await prisma.document.update({
              data: {
                status: "FAILED",
              },
              where: {
                id: documentId,
              },
            });
          }

          throw new AppError("Document upload failed", 400, "FAILED");
        }
      }),
    );

    return res;
  },
};
