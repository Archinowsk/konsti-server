const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
// const validateAuthHeader = require('../../utils/authHeader');

// Get settings
const getResults = (req, res) => {
  logger.info('API call: GET /api/results')

  /*
  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    });
  }
  */

  return db.getResultsData().then(
    response => {
      /*
      const gamesData = {
        blacklistedGames: response.blacklisted_games,
      };
      */

      res.json({
        message: 'Getting results success',
        status: 'success',
        results: response,
      })
    },
    error => {
      logger.error(`Settings: ${error}`)
      res.json({
        message: 'Getting results failed',
        status: 'error',
        error,
      })
    }
  )
}

module.exports = { getResults }
