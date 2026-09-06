import { serverEnv } from "@repo/env/serverEnv";
import { Redis } from "ioredis";

export const redisClient = new Redis(serverEnv.REDIS_URL);
