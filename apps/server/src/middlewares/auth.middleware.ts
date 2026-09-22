import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/better-auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const headers = fromNodeHeaders(req.headers);
    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized Access",
      });
    }
    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    const error = err as Error;
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Unexpected error",
    });
  }
};
