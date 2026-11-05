import { type ScaleFactor, scaleFactorSchema } from '#schemas/audio-tools'
import { analyze, applyGain, reverse } from '#controllers/tools'
import type { FastifyInstance } from 'fastify'
import { validateAudioFile } from '#hooks/audio-prehandler'

/**
 * Defines the routes for audio processing tools, including applying gain, reversing audio, and analyzing audio data.
 * @param fastify - The Fastify instance to register the routes with.
 * @returns void
 * @remarks
 * This function registers three POST routes:
 * - /scale: Applies a gain factor to the audio data.
 * - /reverse: Reverses the audio data.
 * - /analyze: Analyzes the audio data and returns telemetry and statistics.
 * Each route uses the validateAudioFile pre-handler to ensure that the audio file is valid before processing.
 * The /scale route also validates the presence of a gain factor in the request headers.
 * The response for each route is sent as a WAV file for the /scale and /reverse routes, and as JSON for the /analyze route.
 */
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
