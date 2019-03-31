/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'
import validateAuthHeader from 'utils/authHeader'

// Add signup data for user
const postSignup = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/signup')
  const signupData = req.body.signupData

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

  const { selectedGames, username, time } = signupData

  const modifiedSignupData = {
    selectedGames,
    username,
    time,
  }

  try {
    await db.user.saveSignup(modifiedSignupData)

    res.json({
      message: 'Signup success',
      status: 'success',
    })
  } catch (error) {
    res.json({
      message: 'Signup failure',
      status: 'error',
      error,
    })
  }
}

export { postSignup }
