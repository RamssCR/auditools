import type { FastifyReply, FastifyRequest } from 'fastify'
import { bufferToFloat32Array } from '#helpers/buffer'
import status from 'http-status'

/**
 * Validates the audio file in the request body and extracts its data, channels, and sample rate.
 * @param request - The Fastify request object containing the audio file.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the validation is complete. If the audio file is invalid or missing, it sends an appropriate error response.
 */
export const validateAudioFile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const file = await request.file()

  if (!file)
    return reply.status(status.BAD_REQUEST).send({
      success: false,
      message: 'Audio file is missing in the request body',
      data: null,
    })

  const buffer = await file.toBuffer()

  const array = bufferToFloat32Array(buffer)
  if (!array)
    return reply.status(status.BAD_REQUEST).send({
      success: false,
      message:
        'Invalid audio file. Ensure it is a valid WAV file with a proper header.',
      data: null,
    })

  request.audio = {
    data: array,
    channels: buffer.readUInt16LE(22),
    sampleRate: buffer.readUInt32LE(24),
  }
}
