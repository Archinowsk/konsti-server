// @flow
import to from 'await-to-js';
import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { removeDeletedGamesFromUsers } from 'player-assignment/utils/removeDeletedGamesFromUsers';

const removeInvalidGames = async (): Promise<any> => {
  let error;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  [error] = await to(removeDeletedGamesFromUsers());
  if (error) return logger.error(`Error removing invalid games: ${error}`);

  [error] = await to(db.gracefulExit());
  if (error) return logger.error(error);
};

removeInvalidGames();
