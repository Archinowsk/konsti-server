const config = {};

// App info
config.appName = 'Ropecon RPG Signup';

// Server settings
config.port = process.env.PORT || 3000;

// Logging
config.logDir = './logs';

// Variables for production environment
if (process.env.NODE_ENV === 'production') {
  config.env = 'production';
  config.db = process.env.CUSTOMCONNSTR_CosmosDBConnString;
  config.allowedCorsOrigins = [];
}

// Variables for development environment
if (process.env.NODE_ENV === 'development') {
  config.env = 'development';
  config.db = 'mongodb://localhost/ropecon-rpg-signup';
  config.allowedCorsOrigins = ['http://localhost:8080'];
}

module.exports = config;
