import { z } from "zod";

export const attachDocumentSchema = z.object({
  documentId: z.string(),
});

export type AttachDocumentPayload = z.infer<typeof attachDocumentSchema>;