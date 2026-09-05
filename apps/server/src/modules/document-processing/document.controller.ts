import { Request, Response } from "express";

export const DocumentController = {
  uploadDocuments: (req: Request, res: Response) => {
    const {
      message,
    }: {
      message: string;
    } = req.body;

    // return res.json(data);
  },
};
