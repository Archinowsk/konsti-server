const logger = require('../utils/logger').logger;

function allowCrossDomain(req, res, next) {
  const allowedOrigins = ['http://localhost:8080'];
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    // logger.info(`CORS: Allow from ${origin}`);
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    logger.info(`CORS: Block from ${origin}`);
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return next();
}

module.exports = allowCrossDomain;
