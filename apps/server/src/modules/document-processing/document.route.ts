import { Router } from "express";
import { documentsUpload } from "../../lib/multer";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { DocumentController } from "./document.controller";

export const DocumentRouter = Router() as Router;

DocumentRouter.post(
  "/upload-documents",
  authMiddleware,
  documentsUpload.array("files"),
  DocumentController.uploadDocuments,
);
