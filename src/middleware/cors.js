/* @flow */
import { logger } from '../utils/logger'
import config from '../../config'

const allowCrossDomain = (req: Object, res: Object, next: Function) => {
  const allowedOrigins = config.allowedCorsOrigins
  const origin = req.headers.origin

  if (typeof origin !== 'undefined') {
    if (allowedOrigins.indexOf(origin) > -1) {
      // logger.info(`CORS: Allow from ${origin}`);
      res.setHeader('Access-Control-Allow-Origin', origin)
    } else {
      logger.info(`CORS: Block from ${origin}`)
    }
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return next()
}

export default allowCrossDomain
