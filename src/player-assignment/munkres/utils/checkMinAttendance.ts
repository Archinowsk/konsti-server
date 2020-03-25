import { logger } from 'utils/logger';
import { Game } from 'typings/game.typings';
import { Result } from 'typings/result.typings';

export const checkMinAttendance = (
  results: readonly Result[],
  signedGames: readonly Game[]
) => {
  // Check that game minAttendance is fullfilled
  const gameIds = [];

  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10);

    // Figure what games the row numbers are
    let attendanceRange = 0;
    for (let j = 0; j < signedGames.length; j += 1) {
      attendanceRange += signedGames[j].maxAttendance;
      // Found game
      if (selectedRow < attendanceRange) {
        // @ts-ignore
        gameIds.push(signedGames[j].gameId);
        break;
      }
    }
  }

  const counts = {};
  gameIds.forEach((x) => {
    // @ts-ignore
    counts[x] = (counts[x] || 0) + 1;
  });

  // Find games with too few players
  const gamesWithTooFewPlayers = [];
  signedGames.forEach((signedGame) => {
    if (counts[signedGame.gameId] < signedGame.minAttendance) {
      gamesWithTooFewPlayers.push({
        // @ts-ignore
        game: signedGame,
        // @ts-ignore
        players: counts[signedGame.gameId],
      });
      logger.info(
        `Too few people for game "${signedGame.title}" (${
          counts[signedGame.gameId]
        }/${signedGame.minAttendance})`
      );
    }
  });

  return gamesWithTooFewPlayers;
};
