// @flow
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'

// Post feedback data
const postFeedback: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/feedback')
  const feedbackData = req.body.feedbackData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    return res.sendStatus(401)
  }

  try {
    await db.feedback.saveFeedback(feedbackData)
    return res.json({
      message: 'Post feedback success',
      status: 'success',
    })
  } catch (error) {
    return res.json({
      message: 'Post feedback failure',
      status: 'error',
      error,
    })
  }
}

export { postFeedback }
