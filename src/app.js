/* @flow */
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

db.connectToDb()

export const app = express()

app.use(helmet())

if (config.enableAccessLog) {
  // Set logger
  logger.info("Express: Overriding 'Express' logger")
  app.use(morgan('dev', { stream }))
}

// Parse body and populate req.body - only accepts JSON
app.use(bodyParser.json({ limit: '100kb', type: '*/*' }))

app.use((err, req, res, next) => {
  if (err) {
    res.sendStatus(400)
  } else {
    next()
  }
})

/*
app.use(
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

if (process.env.NODE_ENV !== 'test') app.use(allowCORS)

app.use('/api', apiRoutes)

// Set static path
const staticPath = path.join(__dirname, '../', 'front')

// Set compression
if (config.bundleCompression) {
  app.use(
    expressStaticGzip(staticPath, {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
    })
  )
} else {
  app.use(express.static(staticPath))
}

// No match, route to index
app.get('/*', (req: Object, res: Object) => {
  res.redirect('/')
})

app.set('port', config.port)
