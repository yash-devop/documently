import { Router } from "express";
import { documentsUpload } from "../../lib/multer";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { DocumentController } from "./document.controller";

export const DocumentRouter = Router() as Router;

DocumentRouter.post(
  "/chats/:chatId/documents",
  authMiddleware,
  documentsUpload.array("files"),
  DocumentController.uploadDocuments,
);

DocumentRouter.get(
  "/chats/:chatId/documents",
  authMiddleware,
  DocumentController.getDocuments,
);
DocumentRouter.post(
  "/chats/:chatId/documents/attach",
  authMiddleware,
  DocumentController.attachDocument,
);
DocumentRouter.get(
  "/documents",
  authMiddleware,
  DocumentController.getAllDocuments,
);
DocumentRouter.get(
  "/chats/:chatId/documents/:documentId",
  authMiddleware,
  DocumentController.getDocument,
);
DocumentRouter.delete(
  "/chats/:chatId/documents/:documentId",
  authMiddleware,
  DocumentController.deleteDocument,
);
DocumentRouter.delete(
  "/chats/:chatId/documents/:documentId/detach",
  authMiddleware,
  DocumentController.detachDocument,
);
DocumentRouter.post(
  "/chats/:chatId/documents/:documentId/download",
  authMiddleware,
  DocumentController.downloadDocument,
);
