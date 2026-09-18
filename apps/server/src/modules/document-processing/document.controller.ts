import { Request, Response } from "express";
import { DocumentService } from "./document.service";

export const DocumentController = {
  uploadDocuments: async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const user = req.user;

    if (!files || files.length < 0) {
      return res.status(400).json({
        message: "Please provide file/s",
        data: null,
      });
    }

    const { chatId } = req.params as {
      chatId: string;
    };

    const data = await DocumentService.uploadDocuments(files, user, chatId);

    return res.json({
      data,
      error: null,
    });
  },
  getDocuments: async (req: Request, res: Response) => {
    const { chatId } = req.params as {
      chatId: string;
    };
    const data = await DocumentService.getDocuments(chatId, req.user.id);

    return res.json({
      data,
      error: null,
    });
  },
  getDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const data = await DocumentService.getDocument(
      chatId,
      documentId,
      req.user.id,
    );

    return res.json({
      data,
      error: null,
    });
  },
  deleteDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const data = await DocumentService.deleteDocument(
      chatId,
      documentId,
      req.user.id,
    );
    return res.json({
      data,
      error: null,
    });
  },
  downloadDocument: async (req: Request, res: Response) => {
    const { documentId, chatId } = req.params as {
      documentId: string;
      chatId: string;
    };
    const url = await DocumentService.downloadDocument(
      chatId,
      documentId,
      req.user.id,
    );

    return res.json({
      data: {
        url,
      },
      error: null,
    });
  },
};
