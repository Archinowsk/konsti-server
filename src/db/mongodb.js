// @flow
import mongoose from 'mongoose';
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { config } from 'config';
import { user } from 'db/user/userService';
import { feedback } from 'db/feedback/feedbackService';
import { game } from 'db/game/gameService';
import { results } from 'db/results/resultsService';
import { settings } from 'db/settings/settingsService';
import { serial } from 'db/serial/serialService';

const connectToDb = async (): Promise<any> => {
  const { dbConnString, dbName } = config;

  logger.info(`MongoDB: Connecting to ${dbConnString}`);

  const options = {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName,
    useFindAndModify: false,
  };

  const [error] = await to(mongoose.connect(dbConnString, options));
  if (error) throw new Error(`MongoDB: Error connecting to DB: ${error}`);

  logger.info(`MongoDB: Connection succesful to ${dbConnString}`);

  mongoose.connection.on('error', error => {
    logger.error(error);
  });
};

const gracefulExit = async () => {
  const { dbConnString } = config;

  try {
    await mongoose.connection.close();
  } catch (error) {
    throw new Error(`Error shutting down db connection: ${error}`);
  }

  logger.info(`MongoDB connection closed: ${dbConnString}`);
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

export const db = {
  connectToDb,
  gracefulExit,
  user,
  feedback,
  game,
  results,
  settings,
  serial,
};
