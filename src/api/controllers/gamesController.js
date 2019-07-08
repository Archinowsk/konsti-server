/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import { updateGames } from 'utils/updateGames'
import type { KompassiGame } from 'flow/game.flow'
import type { $Request, $Response, Middleware } from 'express'

// Update games db from master data
const postGames: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/games')

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    return res.sendStatus(401)
  }

  let games: $ReadOnlyArray<KompassiGame> = []
  let response = null
  try {
    games = await updateGames()
    response = await db.game.saveGames(games)

    return res.json({
      message: 'Games db updated',
      status: 'success',
      games: response,
    })
  } catch (error) {
    return res.json({
      message: 'Games db update failed',
      status: 'error',
    })
  }
}

// Get games from db
const getGames: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/games')

  let games = null
  try {
    games = await db.game.findGames()

    return res.json({
      message: 'Games downloaded',
      status: 'success',
      games: games,
    })
  } catch (error) {
    return res.json({
      message: 'Downloading games failed',
      status: 'error',
      response: error,
    })
  }
}

export { postGames, getGames, updateGames }
