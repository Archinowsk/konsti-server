const requestPromiseNative = require('request-promise-native')
const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const validateAuthHeader = require('../../utils/authHeader')
const config = require('../../../config')

const updateGames = async () => {
  logger.info('Games: GET games from Conbase')

  const options = {
    uri: config.dataUri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true, // Automatically parses the JSON string in the response
  }

  let programItems = null
  try {
    programItems = await requestPromiseNative(options)
  } catch (error) {
    logger.error(`Games: requestPromiseNative(): ${error}`)
    return Promise.reject(error)
  }

  // TODO: Filter roleplaying games in designated locations, i.e. not "hall 5"

  if (programItems) {
    const games = []

    programItems.forEach(game => {
      game.tags.forEach(tag => {
        if (tag === 'Pöytäpelit') {
          games.push(game)
        }
      })
    })
    return games
  }
}

// Update games db from Conbase
const postGames = async (req, res) => {
  logger.info('API call: POST /api/games')

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

  let games = null
  let response = null
  try {
    games = await updateGames()
    response = await db.game.storeGamesData(games)

    res.json({
      message: 'Games db updated',
      status: 'success',
      data: response,
    })
  } catch (error) {
    res.json({
      message: 'Games db update failed',
      status: 'error',
      data: error,
    })
    Promise.reject(error)
  }
}

// Get games from db
const getGames = async (req, res) => {
  logger.info('API call: GET /api/games')

  let games = null
  try {
    games = await db.game.getGamesData()

    res.json({
      message: 'Games downloaded',
      status: 'success',
      games: games,
    })
  } catch (error) {
    res.json({
      message: 'Downloading games failed',
      status: 'error',
      response: error,
    })
  }
}

module.exports = { postGames, getGames }
