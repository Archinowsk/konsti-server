const { createLogger, format, transports } = require('winston')
const { combine, printf, colorize, timestamp, json } = format
const fs = require('fs')
require('winston-daily-rotate-file')

const config = require('../../config')
const { logDir } = config

// Create logs directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: 'info', // info, debug, warn, error
      filename: `${logDir}/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
      format: combine(timestamp(), json()),
    }),

    new transports.Console({
      level: 'info',
      format: combine(
        colorize(),
        timestamp({
          format: 'HH:mm:ss',
        }),
        printf(info => {
          return `${info.timestamp} ${info.level}: ${info.message}`
        })
      ),
    }),
  ],
  exitOnError: false,
})

const stream = {
  write: message => logger.info(message.slice(0, -1)), // Slice to remove line break
}

module.exports = { logger, stream }
