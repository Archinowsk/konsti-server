const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const assignPlayers = require('../../player-assignment/assignPlayers')
const validateAuthHeader = require('../../utils/authHeader')

// Assign players to games
const postPlayers = async (req, res) => {
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

  let users = null
  let games = null
  let assignResults = null

  try {
    users = await db.user.getUsers()
    games = await db.game.getGames()
    assignResults = await assignPlayers(users, games, startingTime)
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

module.exports = { postPlayers }
