import { Prisma, prisma } from "@repo/db";
import { getEmbeddings } from "@repo/embeddings";
import { AppError } from "../../middlewares/error.middleware";
import { LLMService } from "../llm/llm.service";

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

      const recentMessages = await prisma.chatMessage.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        take: 11,
      });

      const historyMessages = recentMessages
        .filter((m) => m.id !== chatMessage.id)
        .reverse()
        .slice(-10);

      const historyString = historyMessages
        .map((m) => `${m.role === "USER" ? "User" : "Assistant"}: ${m.message}`)
        .join("\n");

      const prompt = LLMService.generateSafePrompt(
        contextString,
        historyString,
        message,
      );

      const llmresponse = await LLMService.generateAnswer(prompt);

      await prisma.chatMessage.create({
        data: {
          role: "ASSISTANT",
          chatId,
          message: llmresponse,
        },
      });
      return {
        data: {
          chatMessage,
          contextString,
          llmresponse,
        },
        message: "Message sent successfully",
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

      return { data: chatMessage, message: "Messages fetched successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while fetching chat messages", 400, "FAILED");
    }
  },
};
