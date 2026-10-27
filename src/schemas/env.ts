import { z } from 'zod'

const ONE_MEGABYTE = 1024 * 1024

export const env = z.object({
  ALLOWED_ORIGINS: z
    .string()
    .transform((value) => value.trim().split(','))
    .default(['http://localhost:3000', 'http://localhost:5173']),
  LIMIT: z.coerce.number().int().positive().default(100),
  LOGFILE_NAME: z
    .string()
    .default('app')
    .transform((value) => `${value}.log`),
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'staging'])
    .default('development'),
  PORT: z.coerce.number().int().positive().min(0).max(65536).default(3000),
  THROTTLE_MB_PER_SECOND: z.coerce
    .number()
    .int()
    .positive()
    .transform((bytes) => bytes * ONE_MEGABYTE)
    .default(16384),
})

export type Env = z.infer<typeof env>
