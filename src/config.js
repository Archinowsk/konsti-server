/* @flow */
type Config = {
  appName: string,
  port: number,
  debug: boolean,
  logDir: string,
  enableAccessLog: boolean,
  assignmentStrategy: string,
  env: string,
  db: string,
  jwtSecretKey: string,
  jwtSecretKeyAdmin: string,
  allowedCorsOrigins: Array<string>,
  dataUri: string,
  ASSIGNMENT_ROUNDS: number,
  bundleCompression: boolean,
  autoUpdateGames: boolean,
  assignmentStrategy: string,
  gameUpdateInterval: number,
}

const config: Config = {}

// App info
config.appName = 'Konsti'

// Server settings
config.port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
config.debug = false

// Logging
config.logDir = './logs'
config.enableAccessLog = false

// App settings
config.assignmentStrategy = 'group' // 'munkres', 'group'
config.bundleCompression = false
config.autoUpdateGames = false
config.gameUpdateInterval = 5 // minutes

config.env = process.env.NODE_ENV || 'development'

// Variables for production environment
if (config.env === 'production') {
  config.db = process.env.CONN_STRING || ''
  config.jwtSecretKey = process.env.JWT_SECRET_KEY || ''
  config.jwtSecretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN || ''
  config.allowedCorsOrigins = process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(';')
    : []
  config.dataUri = process.env.GAME_DATA_URI || ''
  config.debug = process.env.DEBUG === 'true' || false
  config.ASSIGNMENT_ROUNDS = 300
}

// Variables for development and test environment
if (config.env === 'development' || config.env === 'test') {
  config.db = 'mongodb://localhost:27017/konsti'
  config.jwtSecretKey = 'secret'
  config.jwtSecretKeyAdmin = 'admin secret'
  config.allowedCorsOrigins = ['http://localhost:8080']
  config.dataUri =
    'https://kompassi.eu/api/v1/events/ropecon2018/programme/ropecon'
  config.debug = true
  config.ASSIGNMENT_ROUNDS = 1
}

module.exports = config
