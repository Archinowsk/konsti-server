const logger = require('../utils/logger').logger;
const db = require('../mongodb');

// Add favorite data for user
const postFavorite = (req, res) => {
  logger.info('API call: POST /api/favorite');
  const favoriteData = req.body.favoriteData;

  db.storeFavoriteData(favoriteData).then(
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
