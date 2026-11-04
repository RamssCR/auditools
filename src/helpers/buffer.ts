// 1. Convert 16-bit PCM integer buffer to 32-bit Float array for C++ KFR
export const convertInt16ToFloat32Array = (
  int16Buffer: Buffer,
): Float32Array => {
  const numSamples = int16Buffer.length / 2
  const float32Array = new Float32Array(numSamples)

  for (let i = 0; i < numSamples; i++) {
    const intVal = int16Buffer.readInt16LE(i * 2)
    float32Array[i] = intVal < 0 ? intVal / 32768.0 : intVal / 32767.0
  }

  return float32Array
}

export const convertFloat32ArrayToInt16Buffer = (
  float32Array: Float32Array,
): Buffer => {
  const numSamples = float32Array.length
  const int16Buffer = Buffer.alloc(numSamples * 2)

  for (let i = 0; i < numSamples; i++) {
    let floatVal = float32Array[i]
    floatVal = Math.max(-1.0, Math.min(1.0, floatVal))

    const intVal =
      floatVal < 0 ? Math.round(floatVal * 32768) : Math.round(floatVal * 32767)
    int16Buffer.writeInt16LE(intVal, i * 2)
  }

  return int16Buffer
}

export const wrapInt16AsWav = (
  pcmInt16Buffer: Buffer,
  sampleRate = 48000,
  numChannels = 1,
): Buffer => {
  const bitsPerSample = 16
  const blockAlign = (numChannels * bitsPerSample) / 8
  const byteRate = sampleRate * blockAlign
  const subchunk2Size = pcmInt16Buffer.length
  const chunkSize = 36 + subchunk2Size

  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(chunkSize, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(numChannels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(subchunk2Size, 40)

  return Buffer.concat([header, pcmInt16Buffer])
}

export const bufferToFloat32Array = (buffer: Buffer): Float32Array | null => {
  if (buffer.length <= 44) return null

  const rawPcmBytes = buffer.subarray(44)
  return convertInt16ToFloat32Array(rawPcmBytes)
}
