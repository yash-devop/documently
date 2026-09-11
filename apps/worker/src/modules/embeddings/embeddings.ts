import { RetryableError } from "../../lib/error";
import { loadTransformer } from "../../lib/embeddings";

export const getEmbeddings = async (textChunks: string[]) => {
  try {
    const transformer = await loadTransformer();

    const res = await transformer(textChunks, {
      pooling: "mean",
      normalize: true,
    });
    return res;
  } catch (error) {
    if (error instanceof RetryableError) {
      throw error;
    }
    throw new RetryableError(
      "EMBEDDING_FAILED",
      "Failed to generate embeddings",
      { cause: error },
    );
  }
};