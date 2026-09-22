import { chatMessageSchema } from "@repo/schemas";
import { Request, Response } from "express";
import { ChatMessageService } from "./message.service";

export const ChatMessageController = {
  getMessages: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };
    const { data, message } = await ChatMessageService.getMessages(
      chatId,
      req.user.id,
    );
    return res.status(200).json({
      status: 200,
      data,
      message,
      error: null,
    });
  },
  sendMessage: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };

    const body = chatMessageSchema.parse(req.body);

    const { data, message } = await ChatMessageService.sendMessage(
      chatId,
      "USER",
      body.message,
    );
    return res.status(201).json({
      status: 201,
      data,
      message,
      error: null,
    });
  },
};
