const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const validateAuthHeader = require('../../utils/authHeader')

// Add signup data for user
const postSignup = (req, res) => {
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
  }

  return db.storeSignupData(signupData).then(
    () => {
      res.json({
        message: 'Signup success',
        status: 'success',
        // response,
      })
    },
    error => {
      res.json({
        message: 'Signup failure',
        status: 'error',
        error,
      })
    }
  )
}

module.exports = { postSignup }
