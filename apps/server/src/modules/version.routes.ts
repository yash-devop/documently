import { Router } from "express";
import { DocumentRouter } from "./document-processing/document.route";

export const VersionRouter = Router() as Router;

VersionRouter.use("/v1", DocumentRouter);
