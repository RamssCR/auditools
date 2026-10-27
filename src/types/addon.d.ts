declare module 'bindings' {
  type Statistics = {
    peakAmplitude: number
    rmsEnergy: number
    isClipped: boolean 
  }

  type AuditoolsExports = {
    applyGain: (buffer: Buffer, gain: number) => Buffer
    reverse: (buffer: Buffer) => Buffer
    analyze: (buffer: Buffer) => Statistics
  }

  function bindings(module: string): AuditoolsExports
  export = bindings
}