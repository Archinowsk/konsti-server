/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'

// Add open signup time to server settings
const postSignupTime = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/signuptime')
  const signupTime = req.body.signupTime

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  try {
    const response = await db.settings.saveSignupTime(signupTime)
    res.json({
      message: 'Signup time set success',
      status: 'success',
      signupTime: response.signupTime,
    })
    return
  } catch (error) {
    res.json({
      message: 'Signup time set failure',
      status: 'error',
      error,
    })
    // return
  }
}

export { postSignupTime }
