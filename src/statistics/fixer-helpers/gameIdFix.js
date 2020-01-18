// @flow
import fs from 'fs';
import { logger } from 'utils/logger';

export const gameIdFix = async (year: number, event: string): Promise<void> => {
  const users = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/users.json`,
      'utf8'
    )
  );

  const results = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/results.json`,
      'utf8'
    )
  );

  const games = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/games.json`,
      'utf8'
    )
  );

  users.forEach(user => {
    const tempFavoritedGames = [];
    const tempEnteredGames = [];
    const tempSignedGames = [];

    games.forEach(game => {
      user.favoritedGames.forEach(favoritedGame => {
        if (game._id === favoritedGame) {
          tempFavoritedGames.push(game.gameId);
        }
      });
      user.enteredGames.forEach(enteredGame => {
        if (game._id === enteredGame.gameDetails) {
          tempEnteredGames.push({ ...enteredGame, gameDetails: game.gameId });
        }
      });
      user.signedGames.forEach(signedGame => {
        if (game._id === signedGame.gameDetails) {
          tempSignedGames.push({ ...signedGame, gameDetails: game.gameId });
        }
      });
    });
    user.favoritedGames = tempFavoritedGames;
    user.enteredGames = tempEnteredGames;
    user.signedGames = tempSignedGames;
  });

  results.forEach(result => {
    games.forEach(game => {
      result.result.forEach(userResult => {
        if (game._id === userResult.enteredGame.gameDetails) {
          userResult.enteredGame = {
            ...userResult.enteredGame,
            gameDetails: game.gameId,
          };
        }
      });
    });
  });

  if (!fs.existsSync(`src/statistics/datafiles/${event}/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${event}/${year}/temp/`);
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/users-gameid-fix.json`,
    JSON.stringify(users, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/results-gameid-fix.json`,
    JSON.stringify(results, null, 2),
    'utf8'
  );

  logger.info('GameIds fixed');
};
