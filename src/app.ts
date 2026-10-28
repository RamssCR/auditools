import {
  ALLOWED_ORIGINS,
  LIMIT,
  NODE_ENV,
  PORT,
  THROTTLE_MB_PER_SECOND,
} from '#config/env'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import Fastify from 'fastify'
import { audiotoolsAddon } from '#plugins/audio-addon'
import { basename } from 'node:path'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import limiter from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import pino from 'pino'
import { routes } from '#routes/index'
import throttle from '@fastify/throttle'
import { transporter } from '#config/pino'

export const app = Fastify({
  loggerInstance: pino(transporter),
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(throttle, {
  bytesPerSecond: THROTTLE_MB_PER_SECOND,
  streamPayloads: true,
  bufferPayloads: true,
  stringPayloads: true,
})

await app.register(cors, {
  origin: NODE_ENV === 'development' ? '*' : ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

await app.register(multipart)

await app.register(helmet, {
  global: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],
      connectSrc: ["'self'", 'cdn.jsdelivr.net'],
    },
  },
})
await app.register(limiter, {
  max: LIMIT,
  timeWindow: 30 * 1000,
})

await app.register(audiotoolsAddon)

app.get('/health', async () => {
  return {
    status: 'OK',
    date: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  }
})

await app.register(routes, { prefix: '/api/v1' })

if (
  basename(import.meta.url) === basename(process.argv[1]) &&
  NODE_ENV !== 'test'
) {
  try {
    await app.listen({ host: '0.0.0.0', port: PORT })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}
