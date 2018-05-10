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
  config.db = process.env.CUSTOMCONNSTR_CosmosDBConnString
  config.jwtSecretKey = process.env.JWT_SECRET_KEY
  config.jwtSecretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN
  config.allowedCorsOrigins = ['https://konsti.ropecon.fi']
}

// Variables for development environment
if (process.env.NODE_ENV === 'development') {
  config.env = 'development'
  config.db = 'mongodb://localhost/ropecon-rpg-signup'
  config.jwtSecretKey = 'secret'
  config.jwtSecretKeyAdmin = 'admin secret'
  config.allowedCorsOrigins = ['http://localhost:8080']
}

module.exports = config
