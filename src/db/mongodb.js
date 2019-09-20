// @flow
import mongoose from 'mongoose'
import { logger } from 'utils/logger'
import { config } from 'config'
import { user } from 'db/user/userService'
import { feedback } from 'db/feedback/feedbackService'
import { game } from 'db/game/gameService'
import { results } from 'db/results/resultsService'
import { settings } from 'db/settings/settingsService'
import { serial } from 'db/serial/serialService'

const connectToDb = async (): Promise<any> => {
  const { dbConnString, dbName } = config

  // Use native Node promises
  mongoose.Promise = global.Promise
  // Don't use Mongoose useFindAndModify
  mongoose.set('useFindAndModify', false)

  try {
    await mongoose.connect(dbConnString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName,
    })
    logger.info('MongoDB: Connection succesful')
  } catch (error) {
    throw new Error(`MongoDB: Error connecting to DB: ${error}`)
  }
}

const gracefulExit = async () => {
  const { dbConnString } = config

  try {
    await mongoose.connection.close()
  } catch (error) {
    throw new Error(`Error shutting down db connection: ${error}`)
  }

  logger.info(`MongoDB: Connection ${dbConnString} closed`)
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit)
process.on('SIGTERM', gracefulExit)

export const db = {
  connectToDb,
  gracefulExit,
  user,
  feedback,
  game,
  results,
  settings,
  serial,
}
