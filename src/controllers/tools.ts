import type { FastifyReply, FastifyRequest } from 'fastify'

export const applyGain = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { addons } = request.server

  const gain = Number(request.headers['x-gain-factor'])
  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const result = addons.applyGain(buffer, gain)

  return reply.header('content-type', 'application/octet-stream').send(result)
}

export const reverse = async (request: FastifyRequest, reply: FastifyReply) => {
  const { addons } = request.server

  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const result = addons.reverse(buffer)

  return reply.header('content-type', 'application/octet-stream').send(result)
}

export const analyze = async (request: FastifyRequest) => {
  const { addons } = request.server

  const audio = await request.file()
  const buffer = await audio!.toBuffer()

  const data = addons.analyze(buffer)

  return {
    success: true,
    message: 'Audio telemetry and statistics generated successfully',
    data,
  }
}
