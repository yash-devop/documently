import { PrismaPg } from "@prisma/adapter-pg";
import { serverEnv } from "@repo/env/serverEnv";
import * as Prisma from "./generated/prisma/client";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
});

export { Prisma };
