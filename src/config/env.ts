import { env } from '#schemas/env'
import { treeifyError } from 'zod'

const parsed = env.safeParse(process.env)

if (!parsed.success) {
  console.error(
    '[Startup Error]: Missing environment variables',
    treeifyError(parsed.error)?.properties,
  )
  process.exit(1)
}

export const {
  ALLOWED_ORIGINS,
  APP_ADDON_NAME,
  LIMIT,
  NODE_ENV,
  PORT,
  THROTTLE_MB_PER_SECOND,
  LOGFILE_NAME,
} = parsed.data
