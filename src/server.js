const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

// const expressJWT = require('express-jwt');

const config = require('../config')

const logger = require('./utils/logger').logger
const stream = require('./utils/logger').stream

const db = require('./mongodb')

const COMPRESSED = ['/client.bundle']

const developmentEnv = config.env === 'development'
// const testingEnv = config.env === 'testing';
const productionEnv = config.env === 'productionEnv'

// TODO: Should be promise
db.connectToDb()

/*
db.connectToDb().then(
  () => {
    logger.info(response)
  },
  error => {
    logger.error(error);
    Promise.reject(error);
  }
);
*/

const allowCORS = require('./middleware/cors')
const apiRoutes = require('./apiRoutes')

const app = express()

if (productionEnv) {
  // Request gzip file if should be compressed
  app.get('*.js', (req, res, next) => {
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
app.use(require('morgan')('dev', { stream }))

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

// Don't use CORS in testing
if (developmentEnv || productionEnv) {
  app.use(allowCORS)
}

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
app.get('/*', (req, res) => {
  res.redirect('/')
})

app.set('port', process.env.PORT || 3000)

const server = app.listen(app.get('port'), () => {
  logger.info(`Express: Server started on port ${server.address().port}`)
})

module.exports = app
