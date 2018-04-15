const logger = require('../utils/logger').logger
const db = require('../mongodb')
const validateAuthHeader = require('../utils/authHeader')

// Add blacklist data to server settings
const postBlacklist = (req, res) => {
  logger.info('API call: POST /api/blacklist')
  const blacklistData = req.body.blacklistData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    })
    return undefined
  }

  return db.storeBlacklistData(blacklistData).then(
    () => {
      res.json({
        message: 'Update blacklist success',
        status: 'success',
      })
    },
    error => {
      res.json({
        message: 'Update blacklist failure',
        status: 'error',
        error,
      })
    }
  )
}

module.exports = { postBlacklist }
