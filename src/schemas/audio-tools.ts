import { z } from 'zod'

export const scaleFactorSchema = z.object({
  'x-gain-factor': z.coerce
    .number()
    .min(0, { error: 'Gain cannot be negative' })
    .max(10, {
      error:
        'Gain factor exceeds safe maximum (10.0) to prevent severe digital clipping.',
    })
    .default(1),
})

export type ScaleFactor = z.infer<typeof scaleFactorSchema>
