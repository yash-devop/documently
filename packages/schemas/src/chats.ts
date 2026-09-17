import { z } from "zod";

export const chatSchema = z.object({
  title: z.string(),
});

export type ChatPayload = z.infer<typeof chatSchema>;
