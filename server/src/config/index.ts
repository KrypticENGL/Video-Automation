import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  MONGO_URI: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\//, 'must start with mongodb:// or mongodb+srv://'),
  JWT_SECRET: z.string().min(32, 'must be at least 32 characters'),
});

export type Config = z.infer<typeof schema>;

/** Pure: validates an env object. Throws one readable Error listing every problem. */
export function loadConfig(env: Record<string, string | undefined>): Config {
  const result = schema.safeParse(env);
  if (result.success) return result.data;
  const lines = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`);
  throw new Error(
    `Invalid environment configuration:\n${lines.join('\n')}\nSee server/.env.example.`,
  );
}

function loadOrExit(): Config {
  if (!process.env.VITEST) {
    try {
      process.loadEnvFile(); // server/.env; absent in production where real env vars are set
    } catch {
      // no .env file: rely on the process environment
    }
  }
  try {
    return loadConfig(process.env);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

export const config = loadOrExit();
