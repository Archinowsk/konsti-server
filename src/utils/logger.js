const winston = require('winston');
const fs = require('fs');
const config = require('../../config');

require('winston-daily-rotate-file');

const logDir = config.logDir;
// Create logs directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    /*
    new winston.transports.File({
      level: 'error', // info, debug, warn, error
      filename: `${logDir}/all-logs.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true,
    }),
    */
    new winston.transports.DailyRotateFile({
      // level: 'error', // info, debug, warn, error
      level: 'info', // info, debug, warn, error
      filename: `${logDir}/log`,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      localTime: true,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true,
    }),
    new winston.transports.Console({
      timestamp() {
        const date = new Date();
        return date.toLocaleTimeString();
      },
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: true,
    }),
  ],
  exitOnError: false,
});

const stream = {
  write: message => logger.info(message.slice(0, -1)), // Slice to remove line break
};

module.exports = { logger, stream };
