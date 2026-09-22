import { GoogleGenAI } from "@google/genai";
import { serverEnv } from "@repo/env/serverEnv";
import { AppError } from "../../middlewares/error.middleware";

const geminiAI = new GoogleGenAI({
  apiKey: serverEnv.GOOGLE_GEMINI_API_KEY,
});
export const LLMService = {
  generateSafePrompt: (context: string, history: string, message: string) => {
    const prompt = `
You are a document-grounded assistant. Answer the user's question using ONLY the context chunks below, resolving references like "it", "that", "Tell me again", or "the second point" against the conversation history.

# Conversation history
${history.trim() ? history : "No prior conversation."}

# Rules
- Use ONLY the provided context. Never use outside knowledge or assumptions.
- If the question is a follow-up to a previous turn (e.g. "Tell me again", "Explain the second point"), resolve it using the conversation history, then answer from the context.
- If the answer is not found in the context, do not guess. Instead, clearly explain that the information is not available in the provided documents and describe what the documents DO cover, then suggest how to rephrase the question.
- Be concise and direct. Answer what was asked, nothing more.
- Never invent facts, numbers, quotes, or sources.

# Context
${context}

# User question
${message}
`;

    return prompt;
  },
  generateAnswer: async (prompt: string) => {
    try {
      const res = await geminiAI.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });
      if (!res.text) {
        throw new AppError("Gemini returned no answer.", 502, "FAILED");
      }

      return res.text;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.log("Gemini error", error);
      throw new AppError("Failed to generate LLM answer", 502, "FAILED", {
        cause: error,
      });
    }
  },
};
