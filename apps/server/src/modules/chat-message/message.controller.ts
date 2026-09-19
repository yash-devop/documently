import { chatMessageSchema } from "@repo/schemas";
import { Request, Response } from "express";
import { ChatMessageService } from "./message.service";

export const ChatMessageController = {
  getMessages: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };
    const data = await ChatMessageService.getMessages(chatId, req.user.id);
    return res.json({
      data,
      error: null,
    });
  },
  sendMessage: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };

    const body = chatMessageSchema.parse(req.body);

    const data = await ChatMessageService.sendMessage(
      chatId,
      "USER",
      body.message,
    );
    return res.json({
      data,
      error: null,
    });
  },
};
