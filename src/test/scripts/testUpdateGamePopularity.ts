import 'array-flat-polyfill';
import { logger } from 'utils/logger';
import { updateGamePopularity } from 'game-popularity/updateGamePopularity';
import { db } from 'db/mongodb';

const testUpdateGamePopularity = async (): Promise<any> => {
  try {
    await db.connectToDb();
  } catch (error) {
    return logger.error(error);
  }

  try {
    await updateGamePopularity();
  } catch (error) {
    return logger.error(`updateGamePopularity error: ${error}`);
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    return logger.error(error);
  }
};

testUpdateGamePopularity().catch((error) => {
  logger.error(error);
});
