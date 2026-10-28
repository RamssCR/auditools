import type { AuditoolsExports } from './audiotools'

declare module 'fastify' {
  interface FastifyInstance {
    addons: AuditoolsExports
  }
}
