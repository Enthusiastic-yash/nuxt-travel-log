import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  // eslint-disable-next-line node/no-process-env
  TURSO_DATABASE_URL: process.env.NODE_ENV === "production"
    ? z.string()
    : z.string().optional(),
  // eslint-disable-next-line node/no-process-env
  TURSO_AUTH_TOKEN: process.env.NODE_ENV === "production"
    ? z.string()
    : z.string().optional(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  AUTH_GITHUB_CLIENT_ID: z.string(),
  AUTH_GITHUB_CLIENT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
