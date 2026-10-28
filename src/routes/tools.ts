import { type ScaleFactor, scaleFactorSchema } from '#schemas/audio-tools'
import { analyze, applyGain, reverse } from '#controllers/tools'
import type { FastifyInstance } from 'fastify'
import { validateAudioFile } from '#hooks/audio-prehandler'

export const toolsRoutes = (fastify: FastifyInstance) => {
  fastify.post<{ Headers: ScaleFactor }>(
    '/scale',
    {
      schema: { headers: scaleFactorSchema },
      preHandler: validateAudioFile,
    },
    applyGain,
  )
  fastify.post('/reverse', { preHandler: validateAudioFile }, reverse)
  fastify.post('/analyze', { preHandler: validateAudioFile }, analyze)
}
