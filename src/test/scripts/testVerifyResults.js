// @flow
import to from 'await-to-js';
import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { verifyResults } from 'player-assignment/test/utils/verifyResults';

const testVerifyResults = async (): Promise<any> => {
  let error, users, results;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  const startTime = '2019-07-26 14:00:00.000Z';

  [error, users] = await to(db.user.findUsers());
  if (error) return logger.error(error);

  [error, results] = await to(db.results.findResult(startTime));
  if (error) return logger.error(error);

  [error] = await to(verifyResults(startTime, users, results));
  if (error) return logger.error(error);

  [error] = await to(db.gracefulExit());
  if (error) return logger.error(error);
};

testVerifyResults();
