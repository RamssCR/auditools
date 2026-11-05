import { describe, expect, test } from 'vitest'
import { env } from '#schemas/env'

describe('Environment Schema', () => {
  test('validates a valid environment object', () => {
    const result = env.safeParse({
      ALLOWED_ORIGINS: 'http://example.com,http://another.com',
      APP_ADDON_NAME: 'MyAddon',
      LIMIT: 50,
      LOGFILE_NAME: 'myapp',
      NODE_ENV: 'production',
      PORT: 8080,
      THROTTLE_MB_PER_SECOND: 8192,
    })
    expect(result.success).toBe(true)
  })

  test('applies default values when fields are missing', () => {
    const result = env.parse({
      ALLOWED_ORIGINS: 'http://example.com',
      APP_ADDON_NAME: 'MyAddon',
      LIMIT: 50,
      LOGFILE_NAME: 'myapp',
      NODE_ENV: 'production',
      PORT: 8080,
    })

    expect(result.THROTTLE_MB_PER_SECOND).toBe(16384)
  })
})
