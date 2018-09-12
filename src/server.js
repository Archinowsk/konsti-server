/* @flow */
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import schedule from 'node-schedule'

// import expressJWT from 'express-jwt'

import config from '/config'
import logger, { stream } from '/utils/logger'
import db from '/db/mongodb'
import allowCORS from '/middleware/cors'
import apiRoutes from '/api/apiRoutes'

import { updateGames } from '/api/controllers/gamesController'

const COMPRESSED = ['/client.bundle']

// const developmentEnv = config.env === 'development'
const productionEnv = config.env === 'productionEnv'

db.connectToDb()

if (productionEnv) {
  // Update games from master data every 5 minutes
  schedule.scheduleJob('*/5 * * * *', async () => {
    const games = await updateGames()
    await db.game.saveGames(games)
  })
}

const app = express()

app.use(helmet())

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

if (config.enableAccessLog) {
  // Set logger
  logger.info("Express: Overriding 'Express' logger")
  app.use(morgan('dev', { stream }))
}

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
