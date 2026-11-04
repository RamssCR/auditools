type Statistics = {
  peakAmplitude: number
  rmsEnergy: number
  isClipped: boolean
}

export type AuditoolsExports = {
  applyGain: (buffer: Float32Array, gain: number) => Float32Array
  reverse: (buffer: Float32Array) => Float32Array
  analyze: (buffer: Float32Array) => Statistics
}
