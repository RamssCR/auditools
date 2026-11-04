import type { AuditoolsExports } from './audiotools'

declare module 'fastify' {
  interface FastifyInstance {
    addons: AuditoolsExports
  }

  interface FastifyRequest {
    audio: {
      data: Float32Array
      channels: number
      sampleRate: number
    }
  }
}
