import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";

export const ChatRouter = Router() as Router;

ChatRouter.get("/chats", authMiddleware, ChatController.getChats);
ChatRouter.get("/chats/:id", authMiddleware, ChatController.getChat);
ChatRouter.post("/chats", authMiddleware, ChatController.createChat);
ChatRouter.delete("/chats/:id", authMiddleware, ChatController.deleteChat);
