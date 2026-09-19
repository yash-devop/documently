import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string(),
});

export type ChatMessagePayload = z.infer<typeof chatMessageSchema>;
