/* @flow */
import { logger } from '../../utils/logger'
import db from '../../db/mongodb'
import validateAuthHeader from '../../utils/authHeader'

// Post feedback data
const postFeedback = async (req: Object, res: Object) => {
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
    return
  }

  try {
    await db.feedback.saveFeedback(feedbackData)
    res.json({
      message: 'Post feedback success',
      status: 'success',
    })
  } catch (error) {
    res.json({
      message: 'Post feedback failure',
      status: 'error',
      error,
    })
  }
}

export { postFeedback }
