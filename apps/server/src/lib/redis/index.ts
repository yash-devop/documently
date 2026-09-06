import { Redis } from "ioredis";
import { serverEnv } from "../zod/env";

export const redisClient = new Redis(serverEnv.REDIS_URL);
