const jwt = require('jsonwebtoken');
const logger = require('../utils/logger').logger;
const config = require('../../config');

const jwtSecretKey = config.jwtSecretKey;

const validateAuthHeader = jwtToken => {
  logger.info('Require JWT');
  try {
    const decoded = jwt.verify(jwtToken, jwtSecretKey);
    return true;
  } catch (e) {
    // return authFail(res);
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
