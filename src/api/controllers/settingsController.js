/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import type { $Request, $Response, Middleware } from 'express'

// Get settings
const getSettings: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/settings')

  try {
    const response = await db.settings.findSettings()

    res.json({
      message: 'Getting settings success',
      status: 'success',
      hiddenGames: response.hiddenGames,
      signupTime: response.signupTime,
      appOpen: response.appOpen,
    })
  } catch (error) {
    logger.error(`Settings: ${error}`)
    res.json({
      message: 'Getting settings failed',
      status: 'error',
      error,
    })
  }
}

export { getSettings }
