import {
  bufferToFloat32Array,
  convertFloat32ArrayToInt16Buffer,
  convertInt16ToFloat32Array,
  wrapInt16AsWav,
} from '#helpers/buffer'
import { describe, expect, test } from 'vitest'

describe('Buffer Helper Functions', () => {
  test('converts Int16 buffer to Float32 array and back', () => {
    const int16Buffer = Buffer.from(Array.from({ length: 100 }, () => 1))
    const float32Array = bufferToFloat32Array(int16Buffer)!
    expect(float32Array).not.toBeNull()

    const convertedInt16Buffer = convertFloat32ArrayToInt16Buffer(float32Array)
    expect(convertedInt16Buffer).not.toBeNull()
  })

  test('converts a negative buffer to Float32 array', () => {
    const buffer = Buffer.alloc(2)
    buffer.writeInt16LE(-16384, 0)

    const result = convertInt16ToFloat32Array(buffer)

    expect(result.length).toBe(1)
    expect(result[0]).toBeCloseTo(-0.5)
  })

  test('converts a negative Float32 array to Int16 buffer', () => {
    const float32Array = new Float32Array([-0.5])
    const result = convertFloat32ArrayToInt16Buffer(float32Array)

    expect(result.length).toBe(2)
    expect(result.readInt16LE(0)).toBe(-16384)
  })

  test('wraps Int16 buffer as WAV', () => {
    const int16Buffer = Buffer.from([0, 0, 127, 255, 255, 127, 0, 128])
    const wavBuffer = wrapInt16AsWav(int16Buffer)
    expect(wavBuffer.length).toBeGreaterThan(44)
  })

  test('handles empty Int16 buffer', () => {
    const int16Buffer = Buffer.alloc(0)
    const float32Array = bufferToFloat32Array(int16Buffer)
    expect(float32Array).toBeNull()

    const wavBuffer = wrapInt16AsWav(int16Buffer)
    expect(wavBuffer.length).toBe(44)
  })
})
