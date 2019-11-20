// @flow
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';

export const removeInvalidSignupsFromUsers = async (): Promise<any> => {
  logger.info('Remove invalid signups from users');

  let users = null;
  try {
    users = await db.user.findUsers();
  } catch (error) {
    logger.error(`findUsers error: ${error}`);
    return logger.error(error);
  }

  try {
    await Promise.all(
      users.map(async user => {
        const signedGames = user.signedGames.filter(signedGame => {
          return signedGame.gameDetails;
        });

        const enteredGames = user.enteredGames.filter(enteredGame => {
          return enteredGame.gameDetails;
        });

        const favoritedGames = user.favoritedGames.filter(favoritedGame => {
          return favoritedGame;
        });

        if (
          user.signedGames.length !== signedGames.length ||
          user.enteredGames.length !== enteredGames.length ||
          user.favoritedGames.length !== favoritedGames.length
        ) {
          await db.user.updateUser({
            ...user,
            signedGames,
            enteredGames,
            favoritedGames,
          });
        }
      })
    );
  } catch (error) {
    logger.error(`db.user.updateUser error: ${error}`);
    return logger.error(error);
  }
};
