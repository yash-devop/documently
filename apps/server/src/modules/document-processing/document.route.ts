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
DocumentRouter.post(
  "/chats/:chatId/documents/:documentId/download",
  authMiddleware,
  DocumentController.downloadDocument,
);
