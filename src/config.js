/* @flow */
import type { Config } from 'flow/config.flow'

const commonConfig = {
  // App info
  appName: 'Konsti',

  // Server settings
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  debug: false,

  // Logging
  logDir: './logs',
  enableAccessLog: false,

  // App settings
  assignmentStrategy: 'group', // 'munkres', 'group'
  bundleCompression: true,
  autoUpdateGames: false,
  gameUpdateInterval: 5, // minutes
}

const prodConfig = {
  db: process.env.CONN_STRING || '',
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN || '',
  allowedCorsOrigins: process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(';')
    : [],
  dataUri: process.env.GAME_DATA_URI || '',
  debug: process.env.DEBUG === 'true' || false,
  ASSIGNMENT_ROUNDS: 300,
}

const stagingConfig = {
  db: process.env.CONN_STRING || '',
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN || '',
  allowedCorsOrigins: process.env.CORS_WHITELIST
    ? process.env.CORS_WHITELIST.split(';')
    : [],
  dataUri: process.env.GAME_DATA_URI || '',
  debug: process.env.DEBUG === 'true' || false,
  ASSIGNMENT_ROUNDS: 300,
}

const devConfig = {
  db: 'mongodb://localhost:27017/konsti',
  jwtSecretKey: 'secret',
  jwtSecretKeyAdmin: 'admin secret',
  allowedCorsOrigins: ['http://localhost:8080'],
  dataUri: 'https://kompassi.eu/api/v1/events/ropecon2018/programme/ropecon',
  debug: true,
  ASSIGNMENT_ROUNDS: 1,
}

const combineConfig = () => {
  if (process.env.SETTINGS === 'production') {
    return { ...commonConfig, ...prodConfig }
  } else if (process.env.SETTINGS === 'staging') {
    return { ...commonConfig, ...stagingConfig }
  }
  return { ...commonConfig, ...devConfig }
}

const config: Config = combineConfig()

module.exports = config
