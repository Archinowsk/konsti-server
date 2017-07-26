const logger = require('../utils/logger').logger;
const db = require('../mongodb');
// const validateAuthHeader = require('../utils/authHeader');

// Get settings
const getSettings = (req, res) => {
  logger.info('API call: GET /api/settings');

  /*
  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    });
    return undefined;
  }
  */

  return db.getSettingsData().then(
    response => {
      const returnData = {
        blacklistedGames: response.blacklisted_games,
      };

      res.json({
        message: 'Getting settings success',
        status: 'success',
        games: returnData,
      });
    },
    error => {
      logger.error(`Settings: ${error}`);
      res.json({
        message: 'Getting settings failed',
        status: 'error',
        error,
      });
    }
  );
};

module.exports = { getSettings };
