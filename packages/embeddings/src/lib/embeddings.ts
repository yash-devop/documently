import { FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";
import { RetryableError } from "./error";

let transformer: Promise<FeatureExtractionPipeline> | null = null;

export const loadTransformer = () => {
  if (!transformer) {
    transformer = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "q8" },
    ).catch((error: unknown) => {
      transformer = null;
      throw new RetryableError(
        "EMBEDDING_FAILED",
        "Failed to load embedding model",
        { cause: error },
      );
    });
  }
  return transformer;
};
