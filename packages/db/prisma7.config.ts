import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

import { resolveEnvFile } from "@repo/env/resolveEnvFile";

config({ path: await resolveEnvFile() });

export default defineConfig({
  schema: "prisma/",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
