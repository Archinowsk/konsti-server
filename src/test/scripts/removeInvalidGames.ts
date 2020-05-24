import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { removeInvalidSignupsFromUsers } from 'player-assignment/utils/removeInvalidSignupsFromUsers';

const removeInvalidGames = async (): Promise<any> => {
  try {
    await db.connectToDb();
  } catch (error) {
    return logger.error(error);
  }

  try {
    await removeInvalidSignupsFromUsers();
  } catch (error) {
    return logger.error(`Error removing invalid games: ${error}`);
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    return logger.error(error);
  }
};

removeInvalidGames().catch((error) => {
  logger.error(error);
});
