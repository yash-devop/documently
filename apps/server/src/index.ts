import express from "express";
import { serverEnv } from "./lib/zod/env";

const app = express();

app.listen(8000, () => {
  console.log("serverEnv", serverEnv);
  console.log("Server successfully");
});
