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
    res.sendStatus(401)
    return
  }

  const { selectedGames, username } = signupData

  const modifiedSignupData = {
    signedGames: selectedGames,
    username,
  }

  try {
    const response = await db.user.saveSignup(modifiedSignupData)
    res.json({
      message: 'Signup success',
      status: 'success',
      signedGames: response.signedGames,
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
