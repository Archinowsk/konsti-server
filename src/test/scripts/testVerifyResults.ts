import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { verifyResults } from 'player-assignment/test/utils/verifyResults';

const testVerifyResults = async (): Promise<any> => {
  let users, results;

  try {
    await db.connectToDb();
  } catch (error) {
    return logger.error(error);
  }

  const startTime = '2019-07-26 14:00:00.000Z';

  try {
    users = await db.user.findUsers();
  } catch (error) {
    return logger.error(error);
  }

  try {
    results = await db.results.findResult(startTime);
  } catch (error) {
    return logger.error(error);
  }

  try {
    await verifyResults(startTime, users, results);
  } catch (error) {
    return logger.error(error);
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    return logger.error(error);
  }
};

testVerifyResults();
