/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'

// Add hidden data to server settings
const postHidden: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/hidden')
  const hiddenData = req.body.hiddenData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    return res.sendStatus(401)
  }

  try {
    const response = await db.settings.saveHidden(hiddenData)
    return res.json({
      message: 'Update hidden success',
      status: 'success',
      hiddenGames: response.hiddenGames,
    })
  } catch (error) {
    return res.json({
      message: 'Update hidden failure',
      status: 'error',
      error,
    })
  }
}

export { postHidden }
