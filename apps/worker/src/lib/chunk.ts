import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NonRetryableError } from "@repo/embeddings";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export const chunkText = async (text: string) => {
  const chunks = await splitter.splitText(text);

  if (!chunks || chunks.length <= 0) {
    throw new NonRetryableError("CHUNKING_FAILED", "No chunks were created");
  }

  return chunks;
};
