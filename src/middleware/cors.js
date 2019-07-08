/* @flow */
import { logger } from 'utils/logger'
import { config } from 'config'
import type { $Request, $Response, NextFunction, Middleware } from 'express'

export const allowCORS: Middleware = (
  req: $Request,
  res: $Response,
  next: NextFunction
): mixed => {
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
