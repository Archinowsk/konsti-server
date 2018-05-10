const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const validateAuthHeader = require('../../utils/authHeader')

// Post feedback data
const postFeedback = (req, res) => {
  logger.info('API call: POST /api/feedback')
  const feedbackData = req.body.feedbackData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
  }

  return db.storeFeedbackData(feedbackData).then(
    () => {
      res.json({
        message: 'Post feedback success',
        status: 'success',
      })
    },
    error => {
      res.json({
        message: 'Post feedback failure',
        status: 'error',
        error,
      })
    }
  )
}

module.exports = { postFeedback }