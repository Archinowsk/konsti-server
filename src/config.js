/* @flow */
import type { Config } from 'flow/config.flow'

const commonConfig = {
  // App info
  appName: 'Konsti',

  // Server settings
  port:
    typeof process.env.PORT === 'string'
      ? parseInt(process.env.PORT, 10)
      : 3000,
  debug: false,

  // Logging
  logDir: './logs',
  enableAccessLog: false,

  // App settings
  assignmentStrategy: 'group+opa', // 'munkres', 'group', 'opa', 'group+opa'
  bundleCompression: true,
  CONVENTION_START_TIME: '2019-07-26T12:00:00Z', // UTC date
  removeOverlapSignups: true,
  gamePopularityUpdateMethod: 'assign', // 'signups, 'assign'

  // Development and testing
  generateSignups: true,
  saveTestAssign: false,
}

const prodConfig = {
  dbConnString: process.env.CONN_STRING || '',
  dbName: 'konsti',
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN || '',
  allowedCorsOrigins:
    typeof process.env.CORS_WHITELIST === 'string'
      ? process.env.CORS_WHITELIST.split(';')
      : [],
  dataUri: 'https://kompassi.eu/api/v1/events/ropecon2019/programme/ropecon',
  debug: process.env.DEBUG === 'true' || false,
  GROUP_ASSIGNMENT_ROUNDS: 300,
  OPA_ASSIGNMENT_ROUNDS: 300,
  updateGamePopularityEnabled: true,

  // Cron
  autoUpdateGamesEnabled: true,
  autoUpdateGamePopularityEnabled: true,
  gameUpdateInterval: 5, // minutes
}

const stagingConfig = {
  dbConnString: process.env.CONN_STRING || '',
  dbName: 'konsti',
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  jwtSecretKeyAdmin: process.env.JWT_SECRET_KEY_ADMIN || '',
  allowedCorsOrigins:
    typeof process.env.CORS_WHITELIST === 'string'
      ? process.env.CORS_WHITELIST.split(';')
      : [],
  dataUri: 'https://kompassi.eu/api/v1/events/ropecon2019/programme/ropecon',
  debug: process.env.DEBUG === 'true' || false,
  GROUP_ASSIGNMENT_ROUNDS: 300,
  OPA_ASSIGNMENT_ROUNDS: 300,
  updateGamePopularityEnabled: true,

  // Cron
  autoUpdateGamesEnabled: true,
  autoUpdateGamePopularityEnabled: true,
  gameUpdateInterval: 5, // minutes
}

const devConfig = {
  dbConnString: 'mongodb://localhost:27017',
  dbName: 'konsti',
  jwtSecretKey: 'secret',
  jwtSecretKeyAdmin: 'admin secret',
  allowedCorsOrigins: ['http://localhost:8080'],
  dataUri: 'https://kompassi.eu/api/v1/events/ropecon2019/programme/ropecon',
  debug: false,
  GROUP_ASSIGNMENT_ROUNDS: 1,
  OPA_ASSIGNMENT_ROUNDS: 300,
  updateGamePopularityEnabled: true,

  // Cron
  autoUpdateGamesEnabled: false,
  autoUpdateGamePopularityEnabled: false,
  gameUpdateInterval: 5, // minutes
}

const combineConfig = () => {
  if (process.env.SETTINGS === 'production') {
    return { ...commonConfig, ...prodConfig }
  } else if (process.env.SETTINGS === 'staging') {
    return { ...commonConfig, ...stagingConfig }
  }
  return { ...commonConfig, ...devConfig }
}

export const config: Config = combineConfig()
