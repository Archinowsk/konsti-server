const jwt = require('jsonwebtoken')
const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const comparePasswordHash = require('../../utils/bcrypt').comparePasswordHash
const config = require('../../../config')

const validateLogin = async (loginData, hash) => {
  let response = null
  try {
    response = await comparePasswordHash(loginData.password.trim(), hash)

    // Password matches hash
    if (response === true) {
      // logger.info(`Login: User "${loginData.username}" password match`);
      return true
    }
    // logger.info(`Login: User "${loginData.username}" password doesn't match`);
    return false
  } catch (error) {
    return error
  }
}

const postLogin = async (req, res) => {
  logger.info('API call: POST /api/login')
  const loginData = req.body.loginData

  if (!loginData || !loginData.username || !loginData.password) {
    logger.info('Login: validation failed')
    res.json({
      message: 'Validation error',
      status: 'error',
    })
  }

  let response = null
  try {
    response = await db.user.getUserData(loginData)
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
    response2 = await validateLogin(loginData, response[0].password)

    logger.info(
      `Login: User "${response[0].username}" with "${
        response[0].user_group
      }" account`
    )

    let jwtToken = ''
    if (response[0].user_group === 'admin') {
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
        userGroup: response[0].user_group,
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

module.exports = { postLogin }
