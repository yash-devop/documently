import { serverEnv } from "@repo/env/serverEnv";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/better-auth";
import { corsConfig } from "./lib/cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { VersionRouter } from "./modules/version.routes";

const app = express();
app.use(express.json());
app.use(cors(corsConfig));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", VersionRouter);
app.use(errorMiddleware);
app.listen(8000, async () => {
  console.log("Server 1 successfully");
});
