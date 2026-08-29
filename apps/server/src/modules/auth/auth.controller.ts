import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  register: (req: Request, res: Response) => {
    const {
      message,
    }: {
      message: string;
    } = req.body;

    const data = AuthService.register(message);
    return res.json(data);
  },
};
