import { Router } from "express";
import { AuthController } from "./auth.controller";

export const AuthRouter = Router() as Router;

AuthRouter.get("/register", AuthController.register);
