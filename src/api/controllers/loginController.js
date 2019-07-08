/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateLogin } from 'utils/bcrypt'
import { getJWT, verifyJWT, decodeJWT } from 'utils/jwt'

const postLogin = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/login')
  const { username, password, jwt } = req.body

  if (((!username || !password) && !jwt) || (username && password && jwt)) {
    res.sendStatus(422)
    return
  }

  // Restore session
  if (jwt) {
    const { userGroup } = decodeJWT(jwt)

    const jwtResponse = verifyJWT(jwt, userGroup)

    if (jwtResponse.status === 'error') {
      res.json({
        message: 'Invalid jwt',
        status: 'error',
      })
      return
    }

    if (typeof jwtResponse.username === 'string') {
      let user = null
      try {
        user = await db.user.findUser(jwtResponse.username)
      } catch (error) {
        logger.error(`Login: ${error}`)
        res.json({
          message: 'Session restore error',
          status: 'error',
          error,
        })
        return
      }

      res.json({
        message: 'Session restore success',
        status: 'success',
        username: user.username,
        userGroup: user.userGroup,
        serial: user.serial,
        groupCode: user.groupCode,
        jwt: getJWT(user.userGroup, user.username),
      })
      return
    }
  }

  let user = null
  try {
    user = await db.user.findUser(username)
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
    logger.info(`Login: User "${username}" not found`)
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
    validLogin = await validateLogin(password, user.password)

    logger.info(
      `Login: User "${user.username}" with "${user.userGroup}" user group`
    )

    if (validLogin === true) {
      logger.info(`Login: Password for user "${username}" matches`)
      res.json({
        message: 'User login success',
        status: 'success',
        username: user.username,
        userGroup: user.userGroup,
        serial: user.serial,
        groupCode: user.groupCode,
        jwt: getJWT(user.userGroup, user.username),
      })
      return
    } else {
      logger.info(`Login: Password for user "${username}" doesn't match`)

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
