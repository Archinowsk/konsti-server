/* @flow */
const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')

// Get settings
const getSettings = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/settings')

  let response = null
  try {
    response = await db.settings.getSettings()

    const gamesData = {
      blacklistedGames: response.blacklisted_games,
    }

    res.json({
      message: 'Getting settings success',
      status: 'success',
      games: gamesData,
      signupTime: response.signup_time,
    })
  } catch (error) {
    logger.error(`Settings: ${error}`)
    res.json({
      message: 'Getting settings failed',
      status: 'error',
      error,
    })
  }
}

module.exports = { getSettings }
