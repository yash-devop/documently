import { PDFParse } from "pdf-parse";

export const pdfParser = async (buffer: Buffer) => {
  const parsingTool = new PDFParse({
    data: buffer,
  });

  const TextContent = await parsingTool.getText();

  return TextContent;
};

export const cleanText = (text: string) => {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
