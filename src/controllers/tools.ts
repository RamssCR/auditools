import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  convertFloat32ArrayToInt16Buffer,
  wrapInt16AsWav,
} from '#helpers/buffer'

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

export const reverse = async (request: FastifyRequest, reply: FastifyReply) => {
  const { data, channels, sampleRate } = request.audio
  const { addons } = request.server

  const result = addons.reverse(data)

  const int16Buffer = convertFloat32ArrayToInt16Buffer(result)
  const wavBuffer = wrapInt16AsWav(int16Buffer, sampleRate, channels)

  return reply.header('content-type', 'audio/wav').send(wavBuffer)
}

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
