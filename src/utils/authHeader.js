import jwt from 'jsonwebtoken'
import { logger } from '/utils/logger'
import config from '/config'

const validateAuthHeader = (authHeader, userGroup) => {
  logger.info(`Auth: Require jwt token for "${userGroup}" user group`)

  let jwtToken = ''

  if (authHeader) {
    // Strip 'bearer' from authHeader
    jwtToken = authHeader.split('Bearer ')[1]
  } else {
    logger.info(`Auth: No auth header`)
    return false
  }

  let jwtSecretKey = ''
  if (userGroup === 'admin') {
    jwtSecretKey = config.jwtSecretKeyAdmin
  } else {
    jwtSecretKey = config.jwtSecretKey
  }

  try {
    jwt.verify(jwtToken, jwtSecretKey)
    logger.info(`Auth: Valid jwt token for "${userGroup}" user group`)
    return true
  } catch (e) {
    logger.info(`Auth: Invalid jwt token for "${userGroup}" user group`)
    return false
  }
}

export default validateAuthHeader
