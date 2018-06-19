/* @flow */
import { logger } from '../../utils/logger'
import db from '../../db/mongodb'

// Get settings
const getSettings = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/settings')

  let response = null
  try {
    response = await db.settings.findSettings()

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

export { getSettings }
