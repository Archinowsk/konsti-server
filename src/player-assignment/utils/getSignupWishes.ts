import { logger } from 'utils/logger';
import { User } from 'typings/user.typings';

export const getSignupWishes = (players: ReadonlyArray<User>) => {
  logger.debug('Get signup wishes');
  const signupWishes = [];

  // Get signup wishes for all players
  players.forEach(player => {
    if (player.signedGames.length !== 0) {
      player.signedGames.forEach(signedGame => {
        signupWishes.push({
          username: player.username,
          gameId: signedGame.gameDetails.gameId,
          priority: signedGame.priority,
        });
      });
    }
  });

  logger.debug(`Found ${signupWishes.length} signup wishes`);

  return signupWishes;
};
