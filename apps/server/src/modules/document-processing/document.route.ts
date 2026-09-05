import { Router } from "express";
import { DocumentController } from "./document.controller";

export const DocumentRouter = Router() as Router;

DocumentRouter.get("/upload-documents", DocumentController.uploadDocuments);
