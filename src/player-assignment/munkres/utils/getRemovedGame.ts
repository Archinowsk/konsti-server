import _ from 'lodash';
import { GameWithPlayerCount } from 'typings/game.typings';

export const getRemovedGame = (
  gamesWithTooFewPlayers: readonly GameWithPlayerCount[]
) => {
  // Get games with least players
  const sortedGamesWithTooFewPlayers = _.sortBy(gamesWithTooFewPlayers, [
    game => game.players,
  ]);

  // Find games that are tied to the lowest player count
  const tiedToLowest = [];
  for (let i = 0; i < sortedGamesWithTooFewPlayers.length; i += 1) {
    if (
      sortedGamesWithTooFewPlayers[i].players ===
      _.first(sortedGamesWithTooFewPlayers).players
    )
      // @ts-ignore
      tiedToLowest.push(sortedGamesWithTooFewPlayers[i]);
  }

  const randomIndex = Math.floor(Math.random() * tiedToLowest.length);
  // @ts-ignore
  const removedGame = tiedToLowest[randomIndex].game;

  return removedGame;
};
