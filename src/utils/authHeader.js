/* @flow */
import { verifyJWT } from 'utils/jwt'
import { logger } from 'utils/logger'

export const validateAuthHeader = (authHeader: string, userGroup: string) => {
  logger.debug(`Auth: Require jwt token for user group "${userGroup}"`)
  let jwt = ''

  if (authHeader) {
    // Strip 'bearer' from authHeader
    jwt = authHeader.split('Bearer ')[1]
  } else {
    logger.info(`Auth: No auth header`)
    return false
  }

  const jwtResponse = verifyJWT(userGroup, jwt)

  if (jwtResponse.status !== 'error') {
    logger.debug(`Auth: Valid jwt token for user group "${userGroup}" `)
    return true
  } else {
    logger.info(`Auth: Invalid jwt for user group "${userGroup}"`)

    return false
  }
}
