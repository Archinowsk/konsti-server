const config = {}

// App info
config.appName = 'Konsti'

// Server settings
config.port = process.env.PORT || 3000
config.debug = false

// Logging
config.logDir = './logs'
config.enableAccessLog = false

// App settings
config.assignmentStrategy = 'group' // 'munkres', 'group'

// Variables for production environment
if (process.env.NODE_ENV === 'production') {
  config.env = 'production'
  config.db = process.env.CONN_STRING
  config.jwtSecretKey = process.env.JWT_SECRET_KEY
  config.jwtSecretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN
  config.allowedCorsOrigins = process.env.CORS_WHITELIST.split(';')
  config.dataUri = process.env.GAME_DATA_URI
  config.debug = process.env.DEBUG
  config.ASSIGNMENT_ROUNDS = 300
}

// Variables for development environment
if (process.env.NODE_ENV === 'development') {
  config.env = 'development'
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
