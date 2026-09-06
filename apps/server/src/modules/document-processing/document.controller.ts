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

    const data = await DocumentService.uploadDocuments(files, user);

    return res.json({
      data,
      error: null,
    });
  },
};
