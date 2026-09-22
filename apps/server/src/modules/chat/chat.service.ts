import { prisma } from "@repo/db";
import { AppError } from "../../middlewares/error.middleware";

export const ChatService = {
  createChat: async (title: string, userId: string) => {
    try {
      const data = await prisma.chat.create({
        data: {
          title,
          userId,
        },
      });
      return { data, message: "Chat created successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Chat Creation failed", 400, "FAILED");
    }
  },
  getChats: async (userId: string) => {
    try {
      const data = await prisma.chat.findMany({
        where: {
          userId,
        },
      });
      return { data, message: "Chats fetched successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while fetching all chats", 400, "FAILED");
    }
  },
  getChat: async (chatId: string, userId: string) => {
    try {
      const data = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userId,
        },
      });

      if (!data) {
        throw new AppError(
          `No Chat Data for ${chatId} found`,
          404,
          "NOT_FOUND",
        );
      }
      return { data, message: "Chat fetched successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while fetching chat", 400, "FAILED");
    }
  },
  renameChat: async (chatId: string, title: string, userId: string) => {
    try {
      const data = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userId,
        },
      });

      if (!data) {
        throw new AppError(
          `No Chat Data for ${chatId} found`,
          404,
          "NOT_FOUND",
        );
      }

      return {
        data: await prisma.chat.update({
          where: {
            id: chatId,
          },
          data: {
            title,
          },
        }),
        message: "Chat renamed successfully",
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while renaming chat", 400, "FAILED");
    }
  },
  deleteChat: async (chatId: string, userId: string) => {
    try {
      const data = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userId,
        },
      });

      if (!data) {
        throw new AppError(
          `No Chat Data for ${chatId} found`,
          404,
          "NOT_FOUND",
        );
      }

      await prisma.chat.delete({
        where: {
          id: chatId,
        },
      });

      return { data, message: "Chat deleted successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error while deleting chat", 400, "FAILED");
    }
  },
};
