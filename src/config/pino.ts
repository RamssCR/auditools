import { LOGFILE_NAME } from './env'
import { join } from 'node:path'
import { transport } from 'pino'

export const transporter = transport({
  targets: [
    {
      target: 'pino-pretty',
      level: 'info',
      options: {
        colorize: true,
      },
    },
    {
      target: 'pino-roll',
      level: 'info',
      options: {
        file: join(process.cwd(), 'tmp', LOGFILE_NAME),
        interval: '1d',
        mkdir: true,
      },
    },
  ],
})
