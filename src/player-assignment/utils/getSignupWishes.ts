import { logger } from 'utils/logger';
import { User } from 'typings/user.typings';

export const getSignupWishes = (players: readonly User[]) => {
  logger.debug('Get signup wishes');
  const signupWishes = [];

  // Get signup wishes for all players
  players.forEach(player => {
    if (player.signedGames.length !== 0) {
      player.signedGames.forEach(signedGame => {
        signupWishes.push({
          // @ts-ignore
          username: player.username,
          // @ts-ignore
          gameId: signedGame.gameDetails.gameId,
          // @ts-ignore
          priority: signedGame.priority,
        });
      });
    }
  });

  logger.debug(`Found ${signupWishes.length} signup wishes`);

  return signupWishes;
};
