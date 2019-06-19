/* @flow */
import { logger } from 'utils/logger'
import { config } from 'config'

export const allowCORS = (req: Object, res: Object, next: Function) => {
  const allowedOrigins = config.allowedCorsOrigins
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  } else if (!origin) {
    // logger.info(`CORS: Same origin`)
  } else {
    logger.info(`CORS: Block from ${origin}`)
  }

  return next()
}
