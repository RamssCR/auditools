type Statistics = {
  peakAmplitude: number
  rmsEnergy: number
  isClipped: boolean
}

export type AuditoolsExports = {
  applyGain: (buffer: Buffer, gain: number) => Buffer
  reverse: (buffer: Buffer) => Buffer
  analyze: (buffer: Buffer) => Statistics
}
