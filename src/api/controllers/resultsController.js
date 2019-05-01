/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'

// Get results
const getResults = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/results')
  const startTime = req.query.startTime

  let results
  try {
    results = await db.results.findResults(startTime)
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }

  if (!results) {
    res.json({
      message: 'Getting results success',
      status: 'success',
      results: null,
    })
    return
  }

  let games
  try {
    games = await db.game.findGames()
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }

  let signedGames = []
  let enteredGame = []
  let filledResults = []

  results.result.map(result => {
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
}

export { getResults }
