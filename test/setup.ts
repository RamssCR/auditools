import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.resetAllMocks()
  vi.restoreAllMocks()
  vi.resetModules()
  vi.useRealTimers()
})

vi.stubEnv('NODE_ENV', 'test')
