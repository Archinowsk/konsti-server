const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const validateAuthHeader = require('../utils/authHeader');

// Add favorite data for user
const postFavorite = (req, res) => {
  logger.info('API call: POST /api/favorite');
  const favoriteData = req.body.favoriteData;

  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'user');

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    });
    return undefined;
  }

  return db.storeFavoriteData(favoriteData).then(
    () => {
      res.json({
        message: 'Update favorite success',
        status: 'success',
      });
    },
    error => {
      res.json({
        message: 'Update favorite failure',
        status: 'error',
        error,
      });
    }
  );
};

module.exports = { postFavorite };
