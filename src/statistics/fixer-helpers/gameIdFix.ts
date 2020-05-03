import fs from 'fs';
import { logger } from 'utils/logger';
import { writeJson } from '../statsUtil';
import { SignedGame, EnteredGame, FavoritedGame } from 'typings/user.typings';

export const gameIdFix = async (year: number, event: string): Promise<void> => {
  const users = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/users.json`,
      'utf8'
    )
  );

  logger.info(`Loaded ${users.length} users`);

  const results = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/results.json`,
      'utf8'
    )
  );

  logger.info(`Loaded ${results.length} results`);

  const games = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/games.json`,
      'utf8'
    )
  );

  logger.info(`Loaded ${games.length} games`);

  users.forEach((user) => {
    const tempFavoritedGames = [] as FavoritedGame[];
    const tempEnteredGames = [] as EnteredGame[];
    const tempSignedGames = [] as SignedGame[];

    games.forEach((game) => {
      user.favoritedGames.forEach((favoritedGame) => {
        if (game._id === favoritedGame) {
          tempFavoritedGames.push({ gameId: game.gameId });
        }
      });
      user.enteredGames.forEach((enteredGame) => {
        if (game._id === enteredGame.gameDetails) {
          tempEnteredGames.push({
            ...enteredGame,
            gameDetails: { gameId: game.gameId },
          });
        }
      });
      user.signedGames.forEach((signedGame) => {
        if (game._id === signedGame.gameDetails) {
          tempSignedGames.push({
            ...signedGame,
            gameDetails: { gameId: game.gameId },
          });
        }
      });
    });
    user.favoritedGames = tempFavoritedGames;
    user.enteredGames = tempEnteredGames;
    user.signedGames = tempSignedGames;
  });

  results.forEach((result) => {
    games.forEach((game) => {
      result.results.forEach((userResult) => {
        if (game._id === userResult.enteredGame.gameDetails) {
          userResult.enteredGame = {
            ...userResult.enteredGame,
            gameDetails: { gameId: game.gameId },
          };
        }
      });
    });
  });

  await writeJson(year, event, 'users', users);
  await writeJson(year, event, 'results', results);
};
