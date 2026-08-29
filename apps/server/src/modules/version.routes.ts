import { Router } from "express";
import { AuthRouter } from "./auth/auth.route";

export const VersionRouter = Router() as Router;

VersionRouter.use("/v1", AuthRouter);
