/* @flow */
import logger from '/utils/logger'
import db from '/db/mongodb'
import { hashPassword } from '/utils/bcrypt'
import validateAuthHeader from '/utils/authHeader'

// Register new user
const postUser = async (req: Object, res: Object) => {
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

  let serialFound = false
  try {
    serialFound = await db.serial.findSerial(registrationData.serial.trim())
  } catch (error) {
    logger.error(`Error finding serial: ${error}`)
  }

  // Check for valid serial
  if (!serialFound) {
    logger.info('User: Serial is not valid')
    res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
    })
    return
  }

  logger.info('User: Serial is valid')

  const username = registrationData.username.trim()
  const password = registrationData.password.trim()
  const serial = registrationData.serial.trim()

  // Check that serial is not used
  let response = null
  try {
    // Check if user already exists
    response = await db.user.findUser({ username })
  } catch (error) {
    logger.error(`db.user.findUser(): ${error}`)
  }

  // Username free
  if (!response) {
    let serialResponse = null
    try {
      // Check if serial is used
      serialResponse = await db.user.findSerial({ serial })
    } catch (error) {
      logger.error(`db.user.findSerial(): ${error}`)
    }

    // Serial not used
    if (!serialResponse) {
      let response2 = null
      try {
        response2 = await hashPassword(password)
      } catch (error) {
        logger.error(`hashPassword(): ${error}`)
      }

      if (response2) {
        registrationData.passwordHash = response2

        try {
          await db.user.saveUser(registrationData)
          res.json({
            message: 'User registration success',
            status: 'success',
          })
        } catch (error) {
          logger.error(`db.user.saveUser(): ${error}`)
          res.json({
            message: 'User registration failed',
            status: 'error',
          })
        }
      }
    } else {
      logger.info('User: Serial used')
      res.json({
        code: 12,
        message: 'Invalid serial',
        status: 'error',
      })
    }
  } else {
    logger.info(`User: Username "${username}" is already registered`)
    res.json({
      code: 11,
      message: 'Username in already registered',
      status: 'error',
    })
  }
}

// Get user info
const getUser = async (req: Object, res: Object) => {
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
    return
  }

  try {
    const user = await db.user.findUser({ username })
    const games = await db.game.findGames()

    const arrayToObject = array =>
      array.reduce((obj, item) => {
        obj = item
        return obj
      }, {})

    let enteredGames = []
    let favoritedGames = []
    let signedGames = []

    if (games) {
      if (user && user.enteredGames) {
        enteredGames = user.enteredGames.map(enteredGame => {
          const game = games.filter(game => enteredGame.id === game.id)
          return { ...enteredGame, details: arrayToObject(game) }
        })
      }

      if (user && user.favoritedGames && games) {
        favoritedGames = user.favoritedGames.map(favoritedGame => {
          const game = games.filter(game => favoritedGame.id === game.id)
          return { ...favoritedGame, details: arrayToObject(game) }
        })
      }

      if (user && user.signedGames && games) {
        signedGames = user.signedGames.map(signedGame => {
          const game = games.filter(game => signedGame.id === game.id)
          return { ...signedGame, details: arrayToObject(game) }
        })
      }
    }

    const returnData = {
      enteredGames,
      favoritedGames,
      signedGames,
    }

    res.json({
      message: 'Getting user data success',
      status: 'success',
      games: returnData,
    })
  } catch (error) {
    logger.error(`db.user.findUser(): ${error}`)
    res.json({
      message: 'Getting user data failed',
      status: 'error',
      error,
    })
  }
}

export { postUser, getUser }
