/* @flow */
import requestPromiseNative from 'request-promise-native'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import { config } from 'config'
import type { KompassiGame } from 'flow/game.flow'

const updateGames = async () => {
  logger.info('Games: GET games from remote server')

  const options = {
    uri: config.dataUri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  }

  let programItems = null
  try {
    programItems = await requestPromiseNative(options)
  } catch (error) {
    logger.error(`Games: requestPromiseNative(): ${error}`)
    return Promise.reject(error)
  }

  const games = []

  // TODO: Filter games in designated locations, i.e. not "hall 5"
  if (programItems) {
    programItems.forEach(game => {
      if (game.category_title === 'Roolipeli') {
        games.push(game)
      }
    })
  }
  return games
}

// Update games db from master data
const postGames = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/games')

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  let games: $ReadOnlyArray<KompassiGame> = []
  let response = null
  try {
    games = await updateGames()
    response = await db.game.saveGames(games)

    res.json({
      message: 'Games db updated',
      status: 'success',
      games: response,
    })
  } catch (error) {
    res.json({
      message: 'Games db update failed',
      status: 'error',
    })
    return Promise.reject(error)
  }
}

// Get games from db
const getGames = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/games')

  let games = null
  try {
    games = await db.game.findGames()

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

export { postGames, getGames, updateGames }
