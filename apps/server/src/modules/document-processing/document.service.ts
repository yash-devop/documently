import { User } from "better-auth";
import { randomUUID } from "crypto";
import { DocumentQueue } from "../../lib/bullmq/document-queue";
import { prisma, Prisma } from "@repo/db";
import { deleteFileFromS3, getPresignedUrl, uploadToS3 } from "@repo/utils";
import { AppError } from "../../middlewares/error.middleware";

export const DocumentService = {
  uploadDocuments: async (
    files: Express.Multer.File[],
    user: User,
    chatId: string,
  ) => {
    if (files.length === 0) return;

    const userId = user.id;

    const res = await Promise.all(
      files.map(async (file) => {
        let documentCreated = false;
        const documentId = randomUUID();
        const storageKey = `users/${userId}/${documentId}.pdf`;

        console.log("storagekey", storageKey);

        try {
          const document = await prisma.document.create({
            data: {
              id: documentId,
              userId,
              originalName: file.originalname,
              storageKey,
              mimeType: file.mimetype,
              size: file.size,
              chats: {
                create: {
                  chatId,
                },
              },
            },
          });

          documentCreated = true;

          await uploadToS3({
            key: storageKey,
            body: file.buffer,
            contentType: file.mimetype,
          });

          await DocumentQueue.add("process-document", {
            documentId,
          });

          return {
            id: documentId,
            originalName: file.originalname,
            status: document.status as Prisma.DOCUMENT_STATUS,
          };
        } catch (error) {
          console.log("error", error);
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
  getDocuments: async (chatId: string, userId: string) => {
    try {
      const documents = await prisma.document.findMany({
        where: {
          userId,
          chats: {
            some: {
              chatId,
            },
          },
        },
      });

      if (documents.length === 0) {
        throw new AppError("No documents found.", 404, "NOT_FOUND");
      }

      return documents;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Documents Fetch failed", 400, "FAILED");
    }
  },
  getDocument: async (chatId: string, documentId: string, userId: string) => {
    try {
      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
          userId,
          chats: {
            some: {
              chatId,
            },
          },
        },
      });

      if (!document || !document.id) {
        throw new AppError("No document found.", 404, "NOT_FOUND");
      }

      return document;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Fetching Single Document failed", 400, "FAILED");
    }
  },
  deleteDocument: async (
    chatId: string,
    documentId: string,
    userId: string,
  ) => {
    try {
      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
          chats: {
            some: {
              chatId,
            },
          },
        },
      });

      if (!document) {
        throw new AppError("Document not found.", 404, "NOT_FOUND");
      }

      await deleteFileFromS3(document.storageKey);

      await prisma.document.delete({
        where: {
          id: documentId,
        },
      });

      return { id: documentId };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Deleting Document failed", 400, "FAILED");
    }
  },
  downloadDocument: async (
    chatId: string,
    documentId: string,
    userId: string,
  ) => {
    try {
      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId,
          chats: {
            some: {
              chatId,
            },
          },
        },
      });

      if (!document) {
        throw new AppError("Document not found.", 404, "NOT_FOUND");
      }

      const pdfUrl = getPresignedUrl(document.storageKey);
      return pdfUrl;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Couldn't find Document url", 404, "FAILED");
    }
  },
};
