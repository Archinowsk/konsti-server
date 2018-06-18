/* @flow */
import { logger } from '../../utils/logger'
import db from '../../db/mongodb'
import validateAuthHeader from '../../utils/authHeader'

// Add blacklist data to server settings
const postBlacklist = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/blacklist')
  const blacklistData = req.body.blacklistData

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

  try {
    await db.settings.saveBlacklist(blacklistData)
    res.json({
      message: 'Update blacklist success',
      status: 'success',
    })
  } catch (error) {
    res.json({
      message: 'Update blacklist failure',
      status: 'error',
      error,
    })
  }
}

export { postBlacklist }
