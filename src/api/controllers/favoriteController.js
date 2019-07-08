/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'

// Add favorite data for user
const postFavorite: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/favorite')
  const favoriteData = req.body.favoriteData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  try {
    const saveFavoriteResponse = await db.user.saveFavorite(favoriteData)

    res.json({
      message: 'Update favorite success',
      status: 'success',
      favoritedGames: saveFavoriteResponse.favoritedGames,
    })
  } catch (error) {
    res.json({
      message: 'Update favorite failure',
      status: 'error',
      error,
    })
  }
}

export { postFavorite }
