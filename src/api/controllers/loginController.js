/* @flow */

import jwt from 'jsonwebtoken'
import { logger } from '~/utils/logger'
import db from '~/db/mongodb'
import { comparePasswordHash } from '~/utils/bcrypt'
import config from '~/config'
import type { User } from '~/flow/user.flow'

const validateLogin = async (loginData, hash) => {
  let response = null
  try {
    response = await comparePasswordHash(loginData.password.trim(), hash)

    // Password matches hash
    if (response === true) {
      return true
    }
    return false
  } catch (error) {
    return error
  }
}

const postLogin = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/login')
  const loginData = req.body.loginData

  if (!loginData || !loginData.username || !loginData.password) {
    logger.info('Login: validation failed')
    res.json({
      message: 'Validation error',
      status: 'error',
    })
  }

  let response: User = {
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    username: '',
    password: '',
    userGroup: '',
    serial: '',
    playerGroup: 0,
    created: null,
  }

  try {
    response = await db.user.findUser(loginData)
  } catch (error) {
    logger.error(`Login: ${error}`)
    res.json({
      message: 'User login error',
      status: 'error',
      error,
    })
  }

  // User does not exist
  if (!response) {
    logger.info(`Login: User "${loginData.username}" not found`)
    res.json({
      code: 21,
      message: 'User login error',
      status: 'error',
    })
  }

  // User exists
  let response2 = null
  try {
    response2 = await validateLogin(loginData, response.password)

    logger.info(
      `Login: User "${response.username}" with "${response.userGroup}" account`
    )

    let jwtToken = ''
    if (response.userGroup === 'admin') {
      jwtToken = jwt.sign(
        { username: loginData.username },
        config.jwtSecretKeyAdmin
      )
    } else {
      jwtToken = jwt.sign({ username: loginData.username }, config.jwtSecretKey)
    }
    if (response2 === true) {
      logger.info(
        `Login: Password for user "${loginData.username.trim()}" matches`
      )
      res.json({
        message: 'User login success',
        status: 'success',
        jwtToken,
        userGroup: response.userGroup,
      })
    } else {
      logger.info(
        `Login: Password for user "${loginData.username}" doesn't match`
      )

      res.json({
        code: 21,
        message: 'User login failed',
        status: 'error',
      })
    }
  } catch (error) {
    logger.error(`Login: ${error}`)
    res.json({
      message: 'User login error',
      status: 'error',
      error,
    })
  }
}

export { postLogin }
