const moment = require('moment');
const munkres = require('munkres-js');
const logger = require('./logger').logger;

const assignPlayers = (players, games, startingTime) => {
  logger.info(
    `Munkres: received data for ${players.length} players and ${games.length} games`
  );
  logger.info(`Assigning players for games starting at ${startingTime}`);

  const startingGames = [];
  const date = moment.utc(startingTime).format();

  // Get games that start at defined time
  games.forEach(game => {
    const utcTime = moment.utc(game.date).format();
    if (utcTime === date) {
      startingGames.push(game);
    }
  });

  logger.info(`Found ${startingGames.length} games for this starting time`);

  const signupWishes = [];

  // Get signup wishes for all players
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

  // const startingGamesWishes = [];
  const selectedPlayers = [];
  const selectedGames = [];
  let minAttendance = 0;
  let maxAttendance = 0;

  // Get valid games from games that are starting and games that have wishes
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

  // Get users who have wishes for valid games
  players.forEach(player => {
    let match = false;
    for (let i = 0; i < player.signed_games.length; i += 1) {
      for (let j = 0; j < startingGames.length; j += 1) {
        if (player.signed_games[i].id === startingGames[j].id) {
          match = true;
          break;
        }
      }
      // Player matched, break
      if (match) {
        selectedPlayers.push(player);
        break;
      }
    }
  });

  logger.info(`Found ${selectedPlayers.length} players for this starting time`);

  // Create matrix for the sorting algorithm
  // Each available seat is possible result
  // Sort same game wishes to single array
  const signupMatrix = [];
  let counter = 0;

  // For each starting game...
  selectedGames.forEach(selectedGame => {
    const gameSignups = [];

    // ... check if players have wishes that match with game id
    selectedPlayers.forEach(player => {
      let match = false;
      for (let i = 0; i < player.signed_games.length; i += 1) {
        // Player has wish that matches starting game
        if (selectedGame.id === player.signed_games[i].id) {
          gameSignups.push(player.signed_games[i].priority);
          match = true;
          break;
        }
      }
      // Add "empty" value if no match
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

  // Run the algorithm
  const results = munkres(signupMatrix);

  logger.info(signupMatrix);
  logger.info(results);

  const combinedResult = [];

  // Build signup results
  for (let i = 0; i < results.length; i += 1) {
    // const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    // logger.info(`matrix value: ${matrixValue}`);

    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10);
    logger.info(`selected row: ${selectedRow}`);

    // Player id
    const selectedPlayer = parseInt(results[i][1], 10);
    logger.info(`selected player: ${selectedPlayer}`);

    let attendanceRange = 0;

    // Figure what games the row numbers are
    for (let j = 0; j < selectedGames.length; j += 1) {
      let matchingGame;
      attendanceRange += selectedGames[j].max_attendance;

      logger.info(`attendanceRange: ${attendanceRange}`);

      if (selectedRow < attendanceRange) {
        matchingGame = selectedGames[j];
        combinedResult.push({
          username: selectedPlayers[selectedPlayer].username,
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
