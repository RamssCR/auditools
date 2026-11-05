import type { FastifyInstance } from 'fastify'
import { toolsRoutes } from './tools'

/**
 * Registers the routes for the application with the provided Fastify instance.
 * @param fastify - The Fastify instance to register the routes with.
 * @returns A promise that resolves when the routes have been registered.
 */
export const routes = async (fastify: FastifyInstance) => {
  await fastify.register(toolsRoutes, { prefix: '/tools' })
}
