import express from "express";
import { serverEnv } from "./lib/zod/env";
import cors from "cors";
import { corsConfig } from "./lib/cors";
import { VersionRouter } from "./modules/version.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/better-auth";

const app = express();
app.use(express.json());
app.use(cors(corsConfig));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", VersionRouter);

app.listen(8000, () => {
  console.log("serverEnv", serverEnv);
  console.log("Server successfully");
});
