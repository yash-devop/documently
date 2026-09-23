import { Router } from "express";
import { ChatMessageController } from "./message.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const ChatMessageRouter: Router = Router();

ChatMessageRouter.get(
  "/chats/:chatId/messages",
  authMiddleware,
  ChatMessageController.getMessages,
);
ChatMessageRouter.post(
  "/chats/:chatId/messages/stream",
  authMiddleware,
  ChatMessageController.streamMessage,
);
ChatMessageRouter.post(
  "/chats/:chatId/messages",
  authMiddleware,
  ChatMessageController.sendMessage,
);
