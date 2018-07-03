/* @flow */
import logger from '/utils/logger'
import db from '/db/mongodb'
import assignPlayers from '/player-assignment/assignPlayers'
import validateAuthHeader from '/utils/authHeader'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

// Assign players to games
const postPlayers = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/players')
  const startingTime = req.body.startingTime

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
    return
  }

  let users: Array<User> = []
  let games: Array<Game> = []
  let assignResults: Array<Object> | null = []

  try {
    users = await db.user.findUsers()
    games = await db.game.findGames()

    const strategy = 'munkres'

    assignResults = assignPlayers(users, games, startingTime, strategy)

    if (!assignResults) throw new Error('No assign results')

    await db.results.saveAllSignupResults(assignResults, startingTime)
    await Promise.all(
      assignResults.map(assignResult => {
        return db.user.saveSignupResult(assignResult)
      })
    )
    res.json({
      message: 'Players assign success',
      status: 'success',
      results: assignResults,
    })
  } catch (error) {
    logger.error(`Player assign: ${error}`)
    res.json({
      message: 'Players assign failure',
      status: 'error',
      error,
    })
  }
}

export { postPlayers }
