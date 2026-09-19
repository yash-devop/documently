import { Prisma, prisma } from "@repo/db";
import { getEmbeddings } from "@repo/embeddings";
import { AppError } from "../../middlewares/error.middleware";

export const ChatMessageService = {
  sendMessage: async (
    chatId: string,
    role: Prisma.MessageRole,
    message: string,
  ) => {
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });

      if (!chat) {
        throw new AppError(
          `Chat with id ${chatId} doesnt exists.`,
          400,
          "FAILED",
        );
      }

      const chatMessage = await prisma.chatMessage.create({
        data: {
          message,
          role,
          chatId,
        },
      });

      // get embeddings for question:
      const questionEmbedding = await getEmbeddings([message]);
      const queryVector = `[${questionEmbedding[0].join(",")}]`;

      const similarChunks = await prisma.$queryRaw<
        {
          id: string;
          documentId: string;
          content: string;
          chunkIndex: number;
          distance: number;
        }[]
      >`
        SELECT
          dc."id",
          dc."documentId",
          dc."content",
          dc."chunkIndex",
          dc."embedding" <=> ${queryVector}::vector AS "distance"
        FROM "document_chunk" dc
        INNER JOIN "chat_document" cd ON cd."documentId" = dc."documentId"
        INNER JOIN "document" d ON d."id" = dc."documentId"
        WHERE cd."chatId" = ${chatId}
          AND d."status" = 'READY'
          AND dc."embedding" IS NOT NULL
        ORDER BY dc."embedding" <=> ${queryVector}::vector ASC
        LIMIT 5;
      `;

      const contextString = similarChunks
        .map((chunk, idx) => {
          return `[context ${idx + 1}]: 
          ${chunk.content}`;
        })
        .join("\n\n");

      return {
        chatMessage,
        contextString,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Chat message creation failed", 400, "FAILED");
    }
  },
  getMessages: async (chatId: string, userId: string) => {
    try {
      const chatMessage = await prisma.chatMessage.findMany({
        where: {
          chatId,
          chats: {
            userId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return chatMessage;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while fetching chat messages", 400, "FAILED");
    }
  },
};
