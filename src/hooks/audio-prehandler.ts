import type { FastifyReply, FastifyRequest } from 'fastify'
import status from 'http-status'

export const validateAudioFile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const file = await request.file()

  if (!file)
    return reply.status(status.OK).send({
      success: false,
      message: 'Audio file is missing in the request body',
      data: null,
    })
}
