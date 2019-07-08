/* @flow */
import { validationResult } from 'express-validator'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { hashPassword } from 'utils/bcrypt'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'

// Register new user
const postUser: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/user')
  const { username, password, serial } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  let serialFound = false
  try {
    serialFound = await db.serial.findSerial(serial)
  } catch (error) {
    logger.error(`Error finding serial: ${error}`)
    res.json({
      code: 10,
      message: 'Finding serial failed',
      status: 'error',
    })
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

  // Check that serial is not used
  let user = null
  try {
    // Check if user already exists
    user = await db.user.findUser(username)
  } catch (error) {
    logger.error(`db.user.findUser(): ${error}`)
    res.json({
      code: 10,
      message: 'Finding user failed',
      status: 'error',
    })
  }

  if (user) {
    logger.info(`User: Username "${username}" is already registered`)
    res.json({
      code: 11,
      message: 'Username in already registered',
      status: 'error',
    })
    return
  }

  // Username free
  if (!user) {
    // Check if serial is used
    let serialResponse = null
    try {
      serialResponse = await db.user.findSerial({ serial })
    } catch (error) {
      logger.error(`db.user.findSerial(): ${error}`)
      res.json({
        code: 10,
        message: 'Finding serial failed',
        status: 'error',
      })
      return
    }

    // Serial used
    if (serialResponse) {
      logger.info('User: Serial used')
      res.json({
        code: 12,
        message: 'Invalid serial',
        status: 'error',
      })
      return
    }

    // Serial not used
    if (!serialResponse) {
      let passwordHash = null
      try {
        passwordHash = await hashPassword(password)
      } catch (error) {
        logger.error(`hashPassword(): ${error}`)
        res.json({
          code: 10,
          message: 'Hashing password failed',
          status: 'error',
        })
        return
      }

      if (!passwordHash) {
        logger.info('User: Serial used')
        res.json({
          code: 12,
          message: 'Invalid serial',
          status: 'error',
        })
        return
      }

      if (passwordHash) {
        let saveUserResponse = null
        try {
          saveUserResponse = await db.user.saveUser({
            username,
            passwordHash,
            serial,
          })
        } catch (error) {
          logger.error(`db.user.saveUser(): ${error}`)
          res.json({
            code: 10,
            message: 'User registration failed',
            status: 'error',
          })
          return
        }

        res.json({
          message: 'User registration success',
          status: 'success',
          username: saveUserResponse.username,
          password: saveUserResponse.password,
        })
      }
    }
  }
}

// Get user info
const getUser: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/user')
  const username = req.query.username

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  try {
    const user = await db.user.findUser(username)
    if (!user) return

    const returnData = {
      enteredGames: user.enteredGames,
      favoritedGames: user.favoritedGames,
      signedGames: user.signedGames,
    }

    res.json({
      message: 'Getting user data success',
      status: 'success',
      games: returnData,
    })
    return
  } catch (error) {
    logger.error(`db.user.findUser(): ${error}`)
    res.json({
      message: 'Getting user data failed',
      status: 'error',
      error,
    })
    // return
  }
}

export { postUser, getUser }
