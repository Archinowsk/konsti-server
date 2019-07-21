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
  try {
    games = await updateGames()
  } catch (error) {
    return res.json({
      message: 'Games db update failed',
      status: 'error',
    })
  }

  if (!games || games.length === 0) {
    return res.json({
      message: 'Games db update failed: No games available',
      status: 'error',
    })
  }

  let gameSaveResponse = null
  try {
    gameSaveResponse = await db.game.saveGames(games)
  } catch (error) {
    logger.error(`db.game.saveGames error: ${error}`)
    return res.json({
      message: 'Games db update failed: Saving games failed',
      status: 'error',
    })
  }

  if (!gameSaveResponse) {
    return res.json({
      message: 'Games db update failed: No save response',
      status: 'error',
    })
  }

  return res.json({
    message: 'Games db updated',
    status: 'success',
    games: gameSaveResponse,
  })
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
