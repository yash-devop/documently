import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { ChatPayload } from "@repo/schemas";
export const ChatController = {
  createChat: async (req: Request, res: Response) => {
    try {
      const { title = "Default Chat" }: ChatPayload = req.body;
      const data = await ChatService.createChat(title, req.user.id);

      res.json({
        data: {
          id: data.id,
          name: data.title,
        },
        message: "Chat created successfully",
      });
    } catch (error) {
      throw error;
    }
  },

  getChats: async (req: Request, res: Response) => {
    try {
      const data = await ChatService.getChats(req.user.id);

      res.json({
        data,
        message: "All Chats fetched successfully",
      });
    } catch (error) {
      throw error;
    }
  },
  getChat: async (req: Request, res: Response) => {
    try {
      const {
        id,
      }: {
        id: string;
      } = req.params as {
        id: string;
      };
      const data = await ChatService.getChat(id, req.user.id);

      res.json({
        data,
        message: `${data.title} Fetched successfully`,
      });
    } catch (error) {
      throw error;
    }
  },
  deleteChat: async (req: Request, res: Response) => {
    try {
      const {
        id,
      }: {
        id: string;
      } = req.params as {
        id: string;
      };
      await ChatService.deleteChat(id, req.user.id);

      res.json({
        message: "Chat deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  },
};
