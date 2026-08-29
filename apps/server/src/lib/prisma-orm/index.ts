import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";
import * as Prisma from "../../../generated/prisma/client";
import { serverEnv } from "../zod/env";

const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL });
export const prisma = new PrismaClient({
  adapter,
});

export { Prisma };
