/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'

export const toggleAppOpen = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/toggle-app-open')
  const appOpen = req.body.appOpen

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  try {
    const response = await db.settings.saveToggleAppOpen(appOpen)
    res.json({
      message: 'Update app open success',
      status: 'success',
      appOpen: response.appOpen,
    })
  } catch (error) {
    res.json({
      message: 'Update app open failure',
      status: 'error',
      error,
    })
  }
}
