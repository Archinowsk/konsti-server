/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'

// Get settings
const getSettings = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/settings')

  try {
    const response = await db.settings.findSettings()
    const games = await db.game.findGames()

    let hiddenGames = []
    if (response && response.hiddenGames && games) {
      hiddenGames = response.hiddenGames.map(hiddenGame => {
        const game = games.find(game => hiddenGame.gameId === game.gameId)
        return { ...hiddenGame, ...game.toObject() }
      })
    }

    const gamesData = {
      hiddenGames,
    }

    res.json({
      message: 'Getting settings success',
      status: 'success',
      games: gamesData,
      signupTime: response.signupTime,
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
