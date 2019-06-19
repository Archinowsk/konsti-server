/* @flow */

import jwt from 'jsonwebtoken'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { comparePasswordHash } from 'utils/bcrypt'
import { config } from 'config'
import type { User } from 'flow/user.flow'

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
    res.sendStatus(422)
    return
  }

  let user: User = {
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    username: '',
    password: '',
    userGroup: '',
    serial: '',
    playerGroup: '0',
    createdAt: null,
  }

  try {
    user = await db.user.findUser(loginData.username)
  } catch (error) {
    logger.error(`Login: ${error}`)
    res.json({
      message: 'User login error',
      status: 'error',
      error,
    })
    return
  }

  // User does not exist
  if (!user) {
    logger.info(`Login: User "${loginData.username}" not found`)
    res.json({
      code: 21,
      message: 'User login error',
      status: 'error',
    })
    return
  }

  let settingsResponse
  try {
    settingsResponse = await db.settings.findSettings()
  } catch (error) {
    logger.error(`Login: ${error}`)
    res.json({
      message: 'User login error',
      status: 'error',
      error,
    })
    return
  }

  if (!settingsResponse.appOpen && user.userGroup === 'user') {
    res.json({
      code: 22,
      message: 'User login disabled',
      status: 'error',
    })
    return
  }

  // User exists
  let validLogin
  try {
    validLogin = await validateLogin(loginData, user.password)

    logger.info(
      `Login: User "${user.username}" with "${user.userGroup}" user group`
    )

    let jwtToken = ''
    if (user.userGroup === 'admin') {
      jwtToken = jwt.sign(
        { username: loginData.username },
        config.jwtSecretKeyAdmin
      )
    } else {
      jwtToken = jwt.sign({ username: loginData.username }, config.jwtSecretKey)
    }
    if (validLogin === true) {
      logger.info(
        `Login: Password for user "${loginData.username.trim()}" matches`
      )
      res.json({
        message: 'User login success',
        status: 'success',
        jwtToken,
        userGroup: user.userGroup,
        serial: user.serial,
        playerGroup: user.playerGroup,
      })
      return
    } else {
      logger.info(
        `Login: Password for user "${loginData.username}" doesn't match`
      )

      res.json({
        code: 21,
        message: 'User login failed',
        status: 'error',
      })
      return
    }
  } catch (error) {
    logger.error(`Login: ${error}`)
    res.json({
      message: 'User login error',
      status: 'error',
      error,
    })
    // return
  }
}

export { postLogin }
