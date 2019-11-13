// @flow
import moment from 'moment';
import _ from 'lodash';
import { logger } from 'utils/logger';
import type { User } from 'flow/user.flow';

export const verifyUserSignups = async (
  startingTime: string,
  users: Array<User>
): Promise<any> => {
  logger.info('Verify entered games and signups match for users');

  if (!users) {
    logger.error('No users found');
    return;
  }

  users.map(user => {
    const enteredGames = user.enteredGames.filter(
      enteredGame =>
        moment(enteredGame.time).format() === moment(startingTime).format()
    );

    if (!enteredGames || enteredGames.length === 0) return;

    if (enteredGames.length !== 1) {
      logger.error(
        `Too many entered games for time ${startingTime}: ${user.username} - ${enteredGames.length} games`
      );
      return;
    }

    const enteredGame = _.first(enteredGames);

    if (user.signedGames && user.signedGames.length !== 0) {
      const signupFound = user.signedGames.find(signedGame => {
        return (
          signedGame.gameDetails.gameId === enteredGame.gameDetails.gameId &&
          moment(signedGame.time).format() === moment(enteredGame.time).format()
        );
      });

      if (!signupFound) {
        logger.error(
          `Signup not found: ${user.username} - ${enteredGame.gameDetails.title}`
        );
      } else {
        logger.debug(
          `Signup found: ${user.username} - ${enteredGame.gameDetails.title}`
        );
      }
    }
  });
};
