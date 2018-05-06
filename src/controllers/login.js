const jwt = require('jsonwebtoken')
const { logger } = require('../utils/logger')
const db = require('../db/mongodb')
const comparePasswordHash = require('../utils/bcrypt').comparePasswordHash
const config = require('../../config')

const validateLogin = (loginData, hash) =>
  comparePasswordHash(loginData.password.trim(), hash).then(response => {
    // Password matches hash
    if (response === true) {
      // logger.info(`Login: User "${loginData.username}" password match`);
      return true
    }
    // logger.info(`Login: User "${loginData.username}" password doesn't match`);
    return false
  }, error => error)

const postLogin = (req, res) => {
  logger.info('API call: POST /api/login')
  const loginData = req.body.loginData

  if (!loginData || !loginData.username || !loginData.password) {
    logger.info('Login: validation failed')
    res.json({
      message: 'Validation error',
      status: 'error',
    })
  } else {
    db.getUserData(loginData).then(
      response => {
        // User exists
        if (response.length > 0) {
          return validateLogin(loginData, response[0].password).then(
            response2 => {
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
                jwtToken = jwt.sign(
                  { username: loginData.username },
                  config.jwtSecretKey
                )
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
                  `Login: Password for user "${
                    loginData.username
                  }" doesn't match`
                )

                res.json({
                  code: 21,
                  message: 'User login failed',
                  status: 'error',
                })
              }
            },
            error => {
              logger.error(`Login: ${error}`)
              res.json({
                message: 'User login error',
                status: 'error',
                error,
              })
            }
          )
        }
        logger.info(`Login: User "${loginData.username}" not found`)
        res.json({
          code: 21,
          message: 'User login error',
          status: 'error',
        })
        return undefined
      },
      error => {
        logger.error(`Login: ${error}`)
        res.json({
          message: 'User login error',
          status: 'error',
          error,
        })
      }
    )
  }
}

module.exports = { postLogin }
