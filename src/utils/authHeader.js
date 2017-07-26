const jwt = require('jsonwebtoken');
const logger = require('../utils/logger').logger;
const config = require('../../config');

const validateAuthHeader = (authHeader, userGroup) => {
  logger.info(`Require jwt token for "${userGroup}" user group`);

  let jwtToken = '';

  if (authHeader) {
    // Strip 'bearer' from authHeader
    jwtToken = authHeader.split('Bearer ')[1];
  } else {
    logger.info(`Auth: No auth header`);
    return false;
  }

  let jwtSecretKey = '';
  if (userGroup === 'admin') {
    jwtSecretKey = config.jwtSecretKeyAdmin;
  } else {
    jwtSecretKey = config.jwtSecretKey;
  }

  try {
    jwt.verify(jwtToken, jwtSecretKey);
    logger.info(`Auth: Valid jwt token for "${userGroup}" user group`);
    return true;
  } catch (e) {
    // return authFail(res);
    logger.info(`Auth: Invalid jwt token for "${userGroup}" user group`);
    return false;
  }
  /*
  if (!decoded || decoded.auth !== 'magic') {
    return authFail(res);
  } else {
    return privado(res, token);
  }
  */
};

module.exports = validateAuthHeader;
