/* @flow */
import mongoose from 'mongoose'
import logger from 'utils/logger'
import config from 'config'

import user from 'db/user/userService'
import feedback from 'db/feedback/feedbackService'
import game from 'db/game/gameService'
import results from 'db/results/resultsService'
import settings from 'db/settings/settingsService'
import serial from 'db/serial/serialService'

const connectToDb = async () => {
  // Use native Node promises
  mongoose.Promise = global.Promise
  // Don't use Mongoose useFindAndModify
  mongoose.set('useFindAndModify', false)

  // Connect to MongoDB and create/use database
  try {
    await mongoose.connect(config.db, { useNewUrlParser: true })
    logger.info('MongoDB: Connection succesful')
  } catch (error) {
    logger.error(`MongoDB: Error connecting to DB: ${error}`)
    process.exit()
  }
}

const gracefulExit = () => {
  mongoose.connection.close(
    // $FlowFixMe
    () => {
      logger.info(
        `MongoDB: ${config.db} is disconnected through app termination`
      )
      process.exit()
    }
  )
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit)
process.on('SIGTERM', gracefulExit)

const db = {
  connectToDb,
  user,
  feedback,
  game,
  results,
  settings,
  serial,
}

export default db
