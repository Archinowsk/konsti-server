const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const validateAuthHeader = require('../../utils/authHeader')

// Add blacklist data to server settings
const postBlacklist = async (req, res) => {
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
    await db.storeBlacklistData(blacklistData)
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

module.exports = { postBlacklist }
