import { betterAuth, BetterAuthOptions } from "better-auth";
import { serverEnv } from "../zod/env";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma-orm";

console.log("AUTHHH", serverEnv);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_API_KEY,
    },
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_API_KEY,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    },
  },
});
