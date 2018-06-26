/* @flow */
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

// import expressJWT from 'express-jwt'

import config from '~/config'
import { logger, stream } from '~/utils/logger'
import db from '~/db/mongodb'
import allowCORS from '~/middleware/cors'
import apiRoutes from '~/api/apiRoutes'

const COMPRESSED = ['/client.bundle']

// const developmentEnv = config.env === 'development'
const productionEnv = config.env === 'productionEnv'

db.connectToDb()

const app = express()

if (productionEnv) {
  // Request gzip file if should be compressed
  app.get('*.js', (req: Object, res: Object, next: Function) => {
    COMPRESSED.forEach((value, index) => {
      if (req.url.startsWith(value[index])) {
        req.url += '.gz'
        res.set('Content-Encoding', 'gzip')
      }
    }, this)
    next()
  })
}

logger.info(`Node environment: ${config.env}`)

// Set logger
logger.info("Express: Overriding 'Express' logger")
app.use(morgan('dev', { stream }))

// Parse body and populate req.body - only accepts JSON
app.use(bodyParser.json({ limit: '100kb' }))

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

app.use(allowCORS)

app.use('/api', apiRoutes)

// Set static path
const staticPath = path.join(__dirname, '../', 'front')
app.use(express.static(staticPath))

// Set static path for register description
const registerInfoPath = path.join(
  __dirname,
  '../',
  'front',
  'rekisteriseloste.txt'
)
app.use(express.static(registerInfoPath))

// Set static path for Azure Let's encrypt extension
const letsEncryptPath = path.join(__dirname, '../', '.well-known')
app.use(express.static(letsEncryptPath))

// No match, route to index
app.get('/*', (req: Object, res: Object) => {
  res.redirect('/')
})

app.set('port', process.env.PORT || 3000)

const server = app.listen(app.get('port'), () => {
  if (!server) return
  logger.info(`Express: Server started on port ${server.address().port}`)
})

export default app
