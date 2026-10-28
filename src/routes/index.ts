import type { FastifyInstance } from 'fastify'
import { toolsRoutes } from './tools'

export const routes = async (fastify: FastifyInstance) => {
  await fastify.register(toolsRoutes, { prefix: '/tools' })
}
