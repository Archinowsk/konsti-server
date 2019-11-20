// @flow
import to from 'await-to-js';
import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { removeInvalidSignupsFromUsers } from 'player-assignment/utils/removeInvalidSignupsFromUsers';

const removeInvalidGames = async (): Promise<any> => {
  let error;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  [error] = await to(removeInvalidSignupsFromUsers());
  if (error) return logger.error(`Error removing invalid games: ${error}`);

  [error] = await to(db.gracefulExit());
  if (error) return logger.error(error);
};

removeInvalidGames();
