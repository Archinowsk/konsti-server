const config = {}

// App info
config.appName = 'Ropecon RPG Signup'

// Server settings
config.port = process.env.PORT || 3000

// Logging
config.logDir = './logs'

// Variables for production environment
if (process.env.NODE_ENV === 'production') {
  config.env = 'production'
  config.db = process.env.CONN_STRING
  config.jwtSecretKey = process.env.JWT_SECRET_KEY
  config.jwtSecretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN
  config.allowedCorsOrigins = ['https://konsti.ropecon.fi']
  config.dataUri = process.env.GAME_DATA_URI
}

// Variables for development environment
if (process.env.NODE_ENV === 'development') {
  config.env = 'development'
  config.db = 'mongodb://localhost:27017/ropecon-rpg-signup'
  config.jwtSecretKey = 'secret'
  config.jwtSecretKeyAdmin = 'admin secret'
  config.allowedCorsOrigins = ['http://localhost:8080']
  config.dataUri = 'http://archinowsk.kapsi.fi/games.json'
}

module.exports = config
