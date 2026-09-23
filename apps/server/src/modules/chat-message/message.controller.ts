import { chatMessageSchema } from "@repo/schemas";
import { Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware";
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
  streamMessage: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };

    const body = chatMessageSchema.parse(req.body);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    const send = (event: string, payload: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
    };

    res.write(`event: start\nretry: 3000\ndata: {"status":200}\n\n`);

    try {
      const { data, message } = await ChatMessageService.streamAnswer(
        chatId,
        "USER",
        body.message,
        (delta) => send("token", { text: delta }),
      );

      send("done", { status: 201, data, message, error: null });
      res.end();
    } catch (error) {
      const errMessage =
        error instanceof AppError
          ? error.message
          : "Something went wrong while generating the answer";
      send("error", {
        status: 400,
        error: { code: "FAILED", message: errMessage },
        meta: null,
      });
      res.end();
    }
  },
};
