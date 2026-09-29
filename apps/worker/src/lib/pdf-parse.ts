import { PDFParse } from "pdf-parse";
import { RetryableError } from "@repo/embeddings";

export const pdfParser = async (buffer: Buffer) => {
  try {
    const parsingTool = new PDFParse({
      data: buffer,
    });

    const textContent = await parsingTool.getText();
    return textContent;
  } catch (error) {
    throw new RetryableError("PDF_PARSE_FAILED", "PDF Parsing failed", {
      cause: error,
    });
  }
};

export const cleanText = (text: string) => {
  return text
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
