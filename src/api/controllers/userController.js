const { checkSerial } = require('../../utils/serials')
const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const hashPassword = require('../../utils/bcrypt').hashPassword
const validateAuthHeader = require('../../utils/authHeader')

// Register new user
const postUser = async (req, res) => {
  logger.info('API call: POST /api/user')
  const registrationData = req.body.registrationData

  // Validate values
  if (
    !registrationData ||
    !registrationData.username ||
    !registrationData.password ||
    !registrationData.serial
  ) {
    logger.info('User: validation failed')
    res.json({
      message: 'Validation error',
      status: 'error',
    })
  }

  // Check for valid serial
  if (!checkSerial(registrationData.serial.trim())) {
    logger.info('User: Serial does not match')
    res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
    })
  }

  logger.info('User: Serial match')

  const username = registrationData.username.trim()
  const password = registrationData.password.trim()
  const serial = registrationData.serial.trim()

  // Check that serial is not used
  logger.info(registrationData)

  let response = null
  try {
    // Check if user already exists
    response = await db.getUserData({ username })

    // Username free
    if (response.length === 0) {
      let serialResponse = null
      try {
        // Check if serial is used
        serialResponse = await db.getUserSerial({ serial })

        // Serial not used
        if (serialResponse.length === 0) {
          let response2 = null
          try {
            response2 = await hashPassword(password)

            registrationData.passwordHash = response2

            try {
              await db.storeUserData(registrationData)
              res.json({
                message: 'User registration success',
                status: 'success',
              })
            } catch (error) {
              logger.error(`db.storeUserData(): ${error}`)
              res.json({
                message: 'User registration failed',
                status: 'error',
              })
            }
          } catch (error) {
            logger.error(`hashPassword(): ${error}`)
          }
        } else {
          logger.info('User: Serial used')
          res.json({
            code: 12,
            message: 'Invalid serial',
            status: 'error',
          })
        }
      } catch (error) {
        logger.error(`db.getUserSerial(): ${error}`)
      }
    } else {
      logger.info(`User: Username "${username}" is already registered`)
      res.json({
        code: 11,
        message: 'Username in already registered',
        status: 'error',
      })
    }
  } catch (error) {
    logger.error(`db.getUserData(): ${error}`)
  }
}

// Get user info
const getUser = async (req, res) => {
  logger.info('API call: GET /api/user')
  const username = req.query.username

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
  }

  let response = null
  try {
    response = await db.getUserData({ username })

    const returnData = {
      enteredGames: response[0].entered_games,
      favoritedGames: response[0].favorited_games,
      signedGames: response[0].signed_games,
    }

    res.json({
      message: 'Getting user data success',
      status: 'success',
      games: returnData,
    })
  } catch (error) {
    logger.error(`db.getUserData(): ${error}`)
    res.json({
      message: 'Getting user data failed',
      status: 'error',
      error,
    })
  }
}

module.exports = { postUser, getUser }
