// @flow
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
// import expressJWT from 'express-jwt'
import expressStaticGzip from 'express-static-gzip'
import { config } from 'config'
import { logger, stream } from 'utils/logger'
import { db } from 'db/mongodb'
import { allowCORS } from 'middleware/cors'
import { apiRoutes } from 'api/apiRoutes'
import type { $Request, $Response, NextFunction } from 'express'

export const startServer = async () => {
  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(error)
  }

  const server = express()

  server.use(helmet())

  if (config.enableAccessLog) {
    // Set logger
    logger.info("Express: Overriding 'Express' logger")
    server.use(morgan('dev', { stream }))
  }

  // Parse body and populate req.body - only accepts JSON
  server.use(bodyParser.json({ limit: '1000kb', type: '*/*' }))

  server.use(
    '/',
    (err: Error, req: $Request, res: $Response, next: NextFunction) => {
      if (err) {
        return res.sendStatus(400)
      } else {
        return next()
      }
    }
  )

  /*
  server.use(
    expressJWT({ secret: config.jwtSecretKeyAdmin }).unless({
      path: [
        // Allow all paths not starting with "/api"
        { url: /^(?!\/api).*$/i, methods: ['GET'] },
        { url: '/api/login', methods: ['POST', 'OPTIONS'] },
        { url: '/api/user', methods: ['POST', 'OPTIONS'] },
        { url: '/api/games', methods: ['GET', 'OPTIONS'] },
      ],
      ext: ['.js', '.css', '.html'],
    })
  );
  */

  server.use(allowCORS)

  server.use('/api', apiRoutes)

  // Set static path
  const staticPath = path.join(__dirname, '../', 'front')

  // Set compression
  if (config.bundleCompression) {
    server.use(
      expressStaticGzip(staticPath, {
        enableBrotli: true,
        orderPreference: ['br', 'gz'],
      })
    )
  } else {
    server.use(express.static(staticPath))
  }

  server.get('/*', (req: $Request, res: $Response) => {
    res.sendFile(path.join(__dirname, '..', 'front', 'index.html'))
  })

  server.set('port', config.port)

  return server
}

export const closeServer = async (server: Object) => {
  try {
    await db.gracefulExit()
  } catch (error) {
    logger.error(error)
  }
}