import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Username must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpPayload = z.infer<typeof signupSchema>;
