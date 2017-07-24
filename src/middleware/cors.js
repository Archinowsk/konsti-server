const logger = require('../utils/logger').logger;
const config = require('../../config');

function allowCrossDomain(req, res, next) {
  const allowedOrigins = config.allowedCorsOrigins;
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    // logger.info(`CORS: Allow from ${origin}`);
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    logger.info(`CORS: Block from ${origin}`);
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return next();
}

module.exports = allowCrossDomain;
