// @flow
import 'array-flat-polyfill';
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { updateGamePopularity } from 'game-popularity/updateGamePopularity';
import { db } from 'db/mongodb';

const testUpdateGamePopularity = async (): Promise<any> => {
  let error;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  [error] = await to(updateGamePopularity());
  if (error) return logger.error(`updateGamePopularity error: ${error}`);

  [error] = await to(db.gracefulExit());
  if (error) return logger.error(error);
};

testUpdateGamePopularity();
