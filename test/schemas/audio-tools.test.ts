import { describe, expect, test } from 'vitest'
import { scaleFactorSchema } from '#schemas/audio-tools'

describe('Scale Factor Schema', () => {
  test('validates a valid scale factor', () => {
    const result = scaleFactorSchema.safeParse({ 'x-gain-factor': '1.5' })
    expect(result.success).toBe(true)
  })

  test('fails if scale factor is not a number', () => {
    const result = scaleFactorSchema.safeParse({
      'x-gain-factor': 'not-a-number',
    })
    expect(result.success).toBe(false)
  })
})
