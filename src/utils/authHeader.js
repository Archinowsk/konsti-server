/* @flow */
import jwt from 'jsonwebtoken'
import logger from 'utils/logger'
import config from 'config'

const validateAuthHeader = (authHeader: string, userGroup: string) => {
  logger.debug(`Auth: Require jwt token for user group "${userGroup}"`)
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
    logger.debug(`Auth: Valid jwt token for user group "${userGroup}" `)
    return true
  } catch (e) {
    logger.info(`Auth: Invalid jwt for user group "${userGroup}"`)
    return false
  }
}

export default validateAuthHeader
