import { PDFParse } from "pdf-parse";
import { RetryableError } from "./error";

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
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
