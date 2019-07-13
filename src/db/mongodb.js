/* @flow */
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
      dbName: dbName,
    })
    logger.info('MongoDB: Connection succesful')
  } catch (error) {
    logger.error(`MongoDB: Error connecting to DB: ${error}`)
    process.exit()
  }
}

const gracefulExit = () => {
  const { dbConnString } = config

  mongoose.connection.close(
    // $FlowFixMe
    () => {
      logger.info(
        `MongoDB: ${dbConnString} is disconnected through app termination`
      )
      process.exit()
    }
  )
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit)
process.on('SIGTERM', gracefulExit)

export const db = {
  connectToDb,
  user,
  feedback,
  game,
  results,
  settings,
  serial,
}
