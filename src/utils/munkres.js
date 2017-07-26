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
  let minAttendance = 0;
  let maxAttendance = 0;

  startingGames.forEach(startingGame => {
    for (let i = 0; i < signupWishes.length; i += 1) {
      if (startingGame.id === signupWishes[i].id) {
        selectedGames.push(startingGame);
        minAttendance += startingGame.min_attendance;
        maxAttendance += startingGame.max_attendance;
        break;
      }
    }
  });

  logger.info(
    `Found ${selectedGames.length} games that have signup wishes and ${minAttendance}-${maxAttendance} available seats`
  );

  // Find all wishes that match game ID and store them to same array
  startingGames.forEach(startingGame => {
    signupWishes.forEach(signupWish => {
      if (startingGame.id === signupWish.id) {
        startingGamesWishes.push(signupWish);
      }
    });
  });

  logger.info(
    `Found ${startingGamesWishes.length} signup wishes for this starting time`
  );

  // Sort same game wishes to single array

  // Create matrix for the sorting algorithm
  // Each available seat is possible result
  const signupMatrix = [];
  let counter = 0;

  selectedGames.forEach(selectedGame => {
    const gameSignups = [];

    players.forEach(player => {
      let match = false;
      for (let i = 0; i < player.signed_games.length; i += 1) {
        if (selectedGame.id === player.signed_games[i].id) {
          gameSignups.push(player.signed_games[i].priority);
          match = true;
          break;
        }
      }
      if (!match) {
        gameSignups.push(9);
      }
    });
    // Add one matrix row for each attendance seat
    for (let j = 0; j < selectedGame.max_attendance; j += 1) {
      // Copy array, don't add reference
      signupMatrix[counter] = gameSignups.slice();
      counter += 1;
    }
  });

  // Game signups for the selected time slot

  logger.info(signupMatrix);

  // NOTES
  // Single array is priorities for one game

  const results = munkres(signupMatrix);
  logger.info(results);

  const combinedResult = [];

  for (let i = 0; i < results.length; i += 1) {
    const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    const selectedRow = parseInt(results[i][0], 10);
    const selectedPlayer = parseInt(results[i][1], 10);
    logger.info(`matrix value: ${matrixValue}`);
    logger.info(`selected player: ${selectedPlayer}`);
    logger.info(`selected row: ${selectedRow}`);

    let attendanceRange = 0;
    for (let j = 0; j < selectedGames.length; j += 1) {
      let matchingGame;
      attendanceRange += selectedGames[j].max_attendance;
      if (selectedRow <= attendanceRange) {
        matchingGame = selectedGames[j];
        combinedResult.push({
          username: players[selectedPlayer].username,
          enteredGame: matchingGame.id,
        });
        break;
      }
    }
  }

  /*
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
  */

  return Promise.resolve(combinedResult);
};

module.exports = { assignPlayers };
