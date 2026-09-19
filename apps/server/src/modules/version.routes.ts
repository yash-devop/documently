import { Router } from "express";
import { ChatRouter } from "./chat/chat.route";
import { DocumentRouter } from "./document-processing/document.route";
import { ChatMessageRouter } from "./chat-message/message.route";

export const VersionRouter = Router() as Router;

VersionRouter.use("/v1", DocumentRouter);
VersionRouter.use("/v1", ChatRouter);
VersionRouter.use("/v1", ChatMessageRouter);
