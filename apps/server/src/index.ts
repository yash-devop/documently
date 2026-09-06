import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/better-auth";
import { corsConfig } from "./lib/cors";
import { getPresignedUrl, uploadToS3 } from "./lib/s3/s3";
import { serverEnv } from "./lib/zod/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { VersionRouter } from "./modules/version.routes";

const app = express();
app.use(express.json());
app.use(cors(corsConfig));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", VersionRouter);

app.get("/test", async (req, res) => {
  try {
    // uploadToS3({
    //   key: req.body.key,
    //   body: Buffer.from("hello world"),
    //   contentType: "text/plain",
    // });
    console.log("Running s3");
    const url = await getPresignedUrl(
      "users/w3o3aGw6NKeaG8Hn9zY1y1MJcSWFSaqV/74bb6b37-3bb7-40a4-87a5-587390c14c25.pdf",
    );

    console.log(url);
    res.json({
      message: "file uploaded",
      url,
    });
  } catch (error) {
    console.log("Error in  s3", error);
  }
});

app.use(errorMiddleware);
app.listen(8000, () => {
  console.log("serverEnv", serverEnv);
  console.log("Server successfully");
});
