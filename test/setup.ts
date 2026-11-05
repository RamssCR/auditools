import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { beforeEach, vi } from 'vitest'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import { toolsRoutes } from '#routes/tools'

beforeEach(() => {
  vi.resetAllMocks()
  vi.restoreAllMocks()
  vi.resetModules()
  vi.useRealTimers()
})

vi.stubEnv('NODE_ENV', 'test')

const addons = {
  applyGain: vi.fn(),
  reverse: vi.fn(),
  analyze: vi.fn(),
}

export const app = Fastify()
  .setSerializerCompiler(serializerCompiler)
  .setValidatorCompiler(validatorCompiler)
  .withTypeProvider<ZodTypeProvider>()

app.register(multipart)
app.decorate('addons', addons)

app.register(toolsRoutes, { prefix: '/audio' })
