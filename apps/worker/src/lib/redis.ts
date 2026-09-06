import { Redis } from "ioredis";
import { serverEnv } from "./schema";

export const redisClient = new Redis(serverEnv.REDIS_URL, {
  maxRetriesPerRequest: null,
});
