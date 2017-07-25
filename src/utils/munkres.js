const moment = require('moment');
const munkres = require('munkres-js');
const logger = require('./logger').logger;

/*
const runMunkres = signupMatrix => {
  // const result = munkres([[400, 150, 400], [400, 450, 600], [300, 225, 300]]);
  // => [ [ 0, 1 ], [ 1, 0 ], [ 2, 2 ] ]

  // const result = munkres(signupMatrix);
  // logger.info(result);
};
*/

const assignPlayers = (players, games, startingTime) => {
  logger.info(
    `Munkres: received data for ${players.length} players and ${games.length} games`
  );
  logger.info(`Assigning players for games starting at ${startingTime}`);

  const startingGames = [];
  const date = moment.utc(startingTime).format();

  games.forEach(game => {
    const utcTime = moment.utc(game.date).format();
    if (utcTime === date) {
      startingGames.push(game);
    }
  });

  logger.info(`Found ${startingGames.length} games for this starting time`);

  const signupWishes = [];

  players.forEach(player => {
    player.signed_games.forEach(signedGame => {
      signupWishes.push({
        username: player.username,
        id: signedGame.id,
        priority: signedGame.priority,
      });
    });
  });

  logger.info(`Found ${signupWishes.length} signup wishes`);

  const startingGamesWishes = [];
  const selectedGames = [];

  startingGames.forEach(startingGame => {
    for (let i = 0; i < signupWishes.length; i += 1) {
      if (startingGame.id === signupWishes[i].id) {
        startingGamesWishes.push(signupWishes[i]);
        selectedGames.push(startingGame);
        break;
      }
    }
  });

  // logger.info(signupWishes);

  logger.info(`Found ${selectedGames.length} games that have signup wishes`);

  // Sort same game wishes to single array

  // Game signups for the selected time slot
  startingGamesWishes.forEach(startingGamesWish => {});

  // Games for the selected time slot that have any signups
  selectedGames.forEach(selectedGame => {});

  // Form matrix

  // const signupMatrix = [[], [], []];
  const signupMatrix = [
    [3, 9, 9, 1, 9, 1],
    [3, 9, 9, 1, 9, 1],
    [3, 9, 9, 1, 9, 1],
    [2, 3, 2, 3, 2, 3],
    [2, 3, 2, 3, 2, 3],
    [2, 3, 2, 3, 2, 3],
    [1, 1, 9, 9, 9, 9],
    [1, 1, 9, 9, 9, 9],
    [1, 1, 9, 9, 9, 9],
    [9, 2, 1, 2, 3, 2],
    [9, 2, 1, 2, 3, 2],
    [9, 2, 1, 2, 3, 2],
    [9, 9, 3, 9, 1, 9],
    [9, 9, 3, 9, 1, 9],
    [9, 9, 3, 9, 1, 9],
  ];

  const results = munkres(signupMatrix);
  logger.info(results);

  for (let i = 0; i < results.length; i += 1) {
    const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    logger.info(`matrix value: ${matrixValue}`);
    logger.info(`seledted player ${results[i][1]}`);
  }

  return Promise.resolve();
};

module.exports = { assignPlayers };
