import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { ChatPayload } from "@repo/schemas";
import { AppError } from "../../middlewares/error.middleware";
export const ChatController = {
  createChat: async (req: Request, res: Response) => {
    try {
      const { title = "Default Chat" }: ChatPayload = req.body;
      const { data, message } = await ChatService.createChat(title, req.user.id);

      res.status(201).json({
        status: 201,
        data: {
          id: data.id,
          name: data.title,
        },
        message,
        error: null,
      });
    } catch (error) {
      throw error;
    }
  },

  getChats: async (req: Request, res: Response) => {
    try {
      const { data, message } = await ChatService.getChats(req.user.id);

      res.status(200).json({
        status: 200,
        data,
        message,
        error: null,
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
      const { data, message } = await ChatService.getChat(id, req.user.id);

      res.status(200).json({
        status: 200,
        data,
        message,
        error: null,
      });
    } catch (error) {
      throw error;
    }
  },
  renameChat: async (req: Request, res: Response) => {
    try {
      const {
        id,
      }: {
        id: string;
      } = req.params as {
        id: string;
      };
      const { title }: ChatPayload = req.body;

      if (!title?.trim()) {
        throw new AppError("Chat title is required", 400, "VALIDATION_ERROR");
      }

      const { data, message } = await ChatService.renameChat(
        id,
        title.trim(),
        req.user.id,
      );

      res.status(200).json({
        status: 200,
        data,
        message,
        error: null,
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
      const { data, message } = await ChatService.deleteChat(id, req.user.id);

      res.status(200).json({
        status: 200,
        data,
        message,
        error: null,
      });
    } catch (error) {
      throw error;
    }
  },
};
