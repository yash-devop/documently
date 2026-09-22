import { attachDocumentSchema } from "@repo/schemas";
import { Request, Response } from "express";
import { DocumentService } from "./document.service";

export const DocumentController = {
  uploadDocuments: async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const user = req.user;

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Please provide file/s",
        data: null,
      });
    }

    const { chatId } = req.params as {
      chatId: string;
    };

    const { data, message } = await DocumentService.uploadDocuments(
      files,
      user,
      chatId,
    );

    return res.status(201).json({
      status: 201,
      data,
      message,
      error: null,
    });
  },
  getDocuments: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };
    const { data, message } = await DocumentService.getDocuments(
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
  getAllDocuments: async (req: Request, res: Response) => {
    const { data, message } = await DocumentService.getAllDocuments(
      req.user.id,
    );

    return res.status(200).json({
      status: 200,
      data,
      message,
      error: null,
    });
  },
  attachDocument: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };
    const body = attachDocumentSchema.parse(req.body);

    const { data, message } = await DocumentService.attachDocument(
      chatId,
      body.documentId,
      req.user.id,
    );

    return res.status(201).json({
      status: 201,
      data,
      message,
      error: null,
    });
  },
  getDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const { data, message } = await DocumentService.getDocument(
      chatId,
      documentId,
      req.user.id,
    );

    return res.status(200).json({
      status: 200,
      data,
      message,
      error: null,
    });
  },
  deleteDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const { data, message } = await DocumentService.deleteDocument(
      chatId,
      documentId,
      req.user.id,
    );
    return res.status(200).json({
      status: 200,
      data,
      message,
      error: null,
    });
  },
  downloadDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const { data, message } = await DocumentService.downloadDocument(
      chatId,
      documentId,
      req.user.id,
    );

    return res.status(200).json({
      status: 200,
      data,
      message,
      error: null,
    });
  },
};
