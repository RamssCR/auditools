import { describe, expect, test, vi } from 'vitest'
import { app } from '#test/setup'
import status from 'http-status'

type FakeBufferOptions = {
  channels: number
  sampleRate: number
  size: number
}

const createFakeBuffer = ({
  channels = 1,
  sampleRate = 44100,
  size = 100,
}: Partial<FakeBufferOptions> = {}): FormData => {
  const buffer = Buffer.alloc(size)

  buffer.write('RIFF', 0)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt16LE(channels, 22)
  buffer.writeUInt32LE(sampleRate, 24)

  const formData = new FormData()
  const blob = new Blob([buffer], { type: 'audio/wav' })
  formData.append('file', blob, 'test.wav')

  return formData
}

describe('Audio Routes', () => {
  test('POST /audio/scale - Applies gain to the audio file', async () => {
    const expected = new Float32Array([0.1, 0.2, 0.3, 0.4])
    vi.spyOn(app.addons, 'applyGain').mockReturnValue(expected)

    const form = createFakeBuffer()

    const response = await app.inject({
      method: 'POST',
      url: '/audio/scale',
      headers: { 'x-gain-factor': '2.0' },
      payload: form,
    })

    expect(app.addons.applyGain).toHaveBeenCalledOnce()
    expect(response.statusCode).toBe(status.OK)
    expect(response.headers['content-type']).toContain('audio/wav')
  })

  test('POST /audio/reverse - Reverses the audio file', async () => {
    const expected = new Float32Array([0.4, 0.3, 0.2, 0.1])
    vi.spyOn(app.addons, 'reverse').mockReturnValue(expected)

    const form = createFakeBuffer()

    const response = await app.inject({
      method: 'POST',
      url: '/audio/reverse',
      payload: form,
    })

    expect(app.addons.reverse).toHaveBeenCalledOnce()
    expect(response.statusCode).toBe(status.OK)
    expect(response.headers['content-type']).toContain('audio/wav')
  })

  test('POST /audio/analyze - Analyzes the audio file', async () => {
    const expected = { peakAmplitude: 0.5, rmsEnergy: 0.3, isClipped: false }
    vi.spyOn(app.addons, 'analyze').mockReturnValue(expected)

    const form = createFakeBuffer()

    const response = await app.inject({
      method: 'POST',
      url: '/audio/analyze',
      payload: form,
    })

    expect(app.addons.analyze).toHaveBeenCalledOnce()
    expect(response.statusCode).toBe(status.OK)
    expect(response.headers['content-type']).toContain('application/json')
  })

  test('POST /audio/scale - Missing audio file', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/audio/scale',
      headers: { 'x-gain-factor': '2.0' },
      payload: new FormData(),
    })

    expect(response.statusCode).toBe(status.BAD_REQUEST)
    expect(response.json()).toEqual({
      success: false,
      message: 'Audio file is missing in the request body',
      data: null,
    })
  })

  test('POST /audio/reverse - Invalid audio file', async () => {
    const form = new FormData()
    const blob = new Blob(['invalid data'], { type: 'audio/wav' })
    form.append('file', blob, 'test.wav')

    const response = await app.inject({
      method: 'POST',
      url: '/audio/reverse',
      payload: form,
    })

    expect(response.statusCode).toBe(status.BAD_REQUEST)
    expect(response.json()).toEqual({
      success: false,
      message:
        'Invalid audio file. Ensure it is a valid WAV file with a proper header.',
      data: null,
    })
  })
})
