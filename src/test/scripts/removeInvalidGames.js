// @flow
import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { removeDeletedGamesFromUsers } from 'db/game/gameService';

const removeInvalidGames = async (): Promise<void> => {
  try {
    await db.connectToDb();
  } catch (error) {
    logger.error(error);
  }

  try {
    await removeDeletedGamesFromUsers();
  } catch (error) {
    logger.error(`Error removing invalid games: ${error}`);
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

removeInvalidGames();
