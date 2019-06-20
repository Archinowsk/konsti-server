/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'

// Add hidden data to server settings
const postHidden = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/hidden')
  const hiddenData = req.body.hiddenData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  try {
    const response = await db.settings.saveHidden(hiddenData)
    res.json({
      message: 'Update hidden success',
      status: 'success',
      hiddenGames: response.hiddenGames,
    })
  } catch (error) {
    res.json({
      message: 'Update hidden failure',
      status: 'error',
      error,
    })
  }
}

export { postHidden }
