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
    const userId = user.id;

    const res = await Promise.all(
      files.map(async (file) => {
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
          await prisma.document.update({
            data: {
              status: "FAILED",
            },
            where: {
              id: documentId,
            },
          });

          throw new AppError("Document upload failed", 400, "FAILED");
        }
      }),
    );

    return { data: res, message: "Documents uploaded successfully" };
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

      return { data: documents, message: "Documents fetched successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Documents Fetch failed", 400, "FAILED");
    }
  },
  getAllDocuments: async (userId: string) => {
    try {
      const documents = await prisma.document.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { data: documents, message: "Documents fetched successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Fetching documents failed", 400, "FAILED");
    }
  },
  attachDocument: async (
    chatId: string,
    documentId: string,
    userId: string,
  ) => {
    try {
      const [chat, document] = await Promise.all([
        prisma.chat.findFirst({
          where: {
            id: chatId,
            userId,
          },
        }),
        prisma.document.findFirst({
          where: {
            id: documentId,
            userId,
          },
        }),
      ]);

      if (!chat) {
        throw new AppError("Chat not found.", 404, "NOT_FOUND");
      }

      if (!document) {
        throw new AppError("Document not found.", 404, "NOT_FOUND");
      }

      await prisma.chatDocument.upsert({
        where: {
          chatId_documentId: {
            chatId,
            documentId,
          },
        },
        update: {},
        create: {
          chatId,
          documentId,
        },
      });

      return { data: document, message: "Document attached successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Attaching document failed", 400, "FAILED");
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

      return { data: document, message: "Document fetched successfully" };
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

      return { data: { id: documentId }, message: "Document deleted successfully" };
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
      return { data: { url: pdfUrl }, message: "Download link generated" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Couldn't find Document url", 404, "FAILED");
    }
  },
};
