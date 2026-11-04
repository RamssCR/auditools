declare module 'bindings' {
  type Statistics = {
    peakAmplitude: number
    rmsEnergy: number
    isClipped: boolean
  }

  type AuditoolsExports = {
    applyGain: (buffer: Float32Array, gain: number) => Float32Array
    reverse: (buffer: Float32Array) => Float32Array
    analyze: (buffer: Float32Array) => Statistics
  }

  function bindings(module: string): AuditoolsExports
  export = bindings
}
