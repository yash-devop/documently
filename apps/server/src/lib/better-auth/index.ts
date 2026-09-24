import { betterAuth, BetterAuthOptions } from "better-auth";
serverEnv;
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { serverEnv } from "@repo/env/serverEnv";

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
      sameSite: serverEnv.BETTER_AUTH_URL.startsWith("https://")
        ? "none"
        : "lax",
    },
  },
});
