import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  convertFloat32ArrayToInt16Buffer,
  wrapInt16AsWav,
} from '#helpers/buffer'

/**
 * Applies a gain factor to the audio data in the request and returns the modified audio as a WAV file.
 * @param request - The Fastify request object containing the audio data and gain factor.
 * @param reply - The Fastify reply object used to send the modified audio data.
 * @returns A promise that resolves when the audio processing is complete and the modified audio is sent in the response.
 */
export const applyGain = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { data, channels, sampleRate } = request.audio
  const { addons } = request.server

  const gain = Number(request.headers['x-gain-factor'])

  const result = addons.applyGain(data, gain)

  const int16Buffer = convertFloat32ArrayToInt16Buffer(result)
  const wavBuffer = wrapInt16AsWav(int16Buffer, sampleRate, channels)

  return reply.header('content-type', 'audio/wav').send(wavBuffer)
}

/**
 * Reverses the audio data in the request and returns the modified audio as a WAV file.
 * @param request - The Fastify request object containing the audio data.
 * @param reply - The Fastify reply object used to send the modified audio data.
 * @returns A promise that resolves when the audio processing is complete and the modified audio is sent in the response.
 */
export const reverse = async (request: FastifyRequest, reply: FastifyReply) => {
  const { data, channels, sampleRate } = request.audio
  const { addons } = request.server

  const result = addons.reverse(data)

  const int16Buffer = convertFloat32ArrayToInt16Buffer(result)
  const wavBuffer = wrapInt16AsWav(int16Buffer, sampleRate, channels)

  return reply.header('content-type', 'audio/wav').send(wavBuffer)
}

/**
 * Analyzes the audio data in the request and returns telemetry and statistics about the audio.
 * @param request - The Fastify request object containing the audio data.
 * @returns A promise that resolves with an object containing the analysis results, including success status, message, and data.
 */
export const analyze = async (request: FastifyRequest) => {
  const { data: audio } = request.audio
  const { addons } = request.server

  const data = addons.analyze(audio)

  return {
    success: true,
    message: 'Audio telemetry and statistics generated successfully',
    data,
  }
}
