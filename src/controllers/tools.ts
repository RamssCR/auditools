import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  bufferToFloat32Array,
  convertFloat32ArrayToInt16Buffer,
  wrapInt16AsWav,
} from '#helpers/buffer'
import status from 'http-status'

export const applyGain = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { addons } = request.server

  const gain = Number(request.headers['x-gain-factor'])
  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const array = bufferToFloat32Array(buffer)
  if (!array)
    return reply.status(status.BAD_REQUEST).send({
      success: false,
      message:
        'Invalid audio file. Ensure it is a valid WAV file with a proper header.',
      data: null,
    })

  const numChannels = buffer.readUInt16LE(22)
  const sampleRate = buffer.readUInt32LE(24)

  const result = addons.applyGain(array, gain)

  const int16Buffer = convertFloat32ArrayToInt16Buffer(result)
  const wavBuffer = wrapInt16AsWav(int16Buffer, sampleRate, numChannels)

  return reply.header('content-type', 'audio/wav').send(wavBuffer)
}

export const reverse = async (request: FastifyRequest, reply: FastifyReply) => {
  const { addons } = request.server

  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const array = bufferToFloat32Array(buffer)
  if (!array)
    return reply.status(status.BAD_REQUEST).send({
      success: false,
      message:
        'Invalid audio file. Ensure it is a valid WAV file with a proper header.',
      data: null,
    })

  const result = addons.reverse(array)

  const int16Buffer = convertFloat32ArrayToInt16Buffer(result)
  const wavBuffer = wrapInt16AsWav(int16Buffer, 50000, 1)

  return reply.header('content-type', 'audio/wav').send(wavBuffer)
}

export const analyze = async (request: FastifyRequest) => {
  const { addons } = request.server

  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const array = bufferToFloat32Array(buffer)
  if (!array)
    return {
      success: false,
      message:
        'Invalid audio file. Ensure it is a valid WAV file with a proper header.',
      data: null,
    }

  const data = addons.analyze(array)

  return {
    success: true,
    message: 'Audio telemetry and statistics generated successfully',
    data,
  }
}
