import express from "express";
import { serverEnv } from "./lib/zod/env";
import cors from "cors";
import { corsConfig } from "./lib/cors";
import { VersionRouter } from "./modules/version.routes";

const app = express();
app.use(express.json());
app.use(cors(corsConfig));
app.use("/", VersionRouter);

app.listen(8000, () => {
  console.log("serverEnv", serverEnv);
  console.log("Server successfully");
});
