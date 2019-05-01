/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'

// Get results
const getResults = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/results')
  const startTime = req.query.startTime

  try {
    const results = await db.results.findResults(startTime)
    const games = await db.game.findGames()

    let signedGames = []
    let enteredGame = []
    let filledResults = []

    results.map(result => {
      signedGames = result.signedGames.map(signedGame => {
        const game = games.find(game => signedGame.gameId === game.gameId)
        return { ...signedGame, ...game.toObject() }
      })

      const game = games.find(game => result.enteredGame.gameId === game.gameId)
      enteredGame = { ...result.enteredGame, ...game.toObject() }

      filledResults.push({
        username: result.username,
        signedGames,
        enteredGame,
      })
    })

    res.json({
      message: 'Getting results success',
      status: 'success',
      results: filledResults,
    })
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }
}

export { getResults }
