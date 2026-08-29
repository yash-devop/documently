import express from "express";
import { serverEnv } from "./lib/zod/env";
import cors from "cors";
import { corsConfig } from "./lib/cors";

const app = express();
app.use(cors(corsConfig));

app.listen(8000, () => {
  console.log("serverEnv", serverEnv);
  console.log("Server successfully");
});
