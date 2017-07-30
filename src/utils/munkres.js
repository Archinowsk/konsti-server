const moment = require('moment');
const munkres = require('munkres-js');
const logger = require('./logger').logger;

const getStargingGames = (games, startingTime) => {
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

  return startingGames;
};

const getSignupWishes = players => {
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

  return signupWishes;
};

const getSelectedGames = (startingGames, signupWishes) => {
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

  return selectedGames;
};

const getSelectedPlayers = (players, startingGames) => {
  // Get users who have wishes for valid games

  const selectedPlayers = [];

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

  return selectedPlayers;
};

const getSignupMatrix = (selectedGames, selectedPlayers) => {
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
          if (typeof player.signed_games[i].priority === 'undefined') {
            gameSignups.push(9);
          } else {
            gameSignups.push(player.signed_games[i].priority);
          }
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

  return signupMatrix;
};

const checkMinAttendance = (results, selectedGames) => {
  // Check that game min_attendance is fullfilled
  const gameIds = [];

  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10);
    // logger.info(`selected row: ${selectedRow}`);

    // Figure what games the row numbers are
    let attendanceRange = 0;
    for (let j = 0; j < selectedGames.length; j += 1) {
      attendanceRange += selectedGames[j].max_attendance;
      // Found game
      if (selectedRow < attendanceRange) {
        gameIds.push(selectedGames[j].id);
        break;
      }
    }
  }

  const counts = {};
  gameIds.forEach(x => {
    counts[x] = (counts[x] || 0) + 1;
  });

  // Find games with too few players
  const gamesWithTooFewPlayers = [];
  selectedGames.forEach(selectedGame => {
    if (counts[selectedGame.id] < selectedGame.min_attendance) {
      gamesWithTooFewPlayers.push({
        game: selectedGame,
        players: counts[selectedGame.id],
      });
      logger.info(
        `Too few people for game ${selectedGame.title} (${counts[
          selectedGame.id
        ]}/${selectedGame.min_attendance})`
      );
    }
  });

  return gamesWithTooFewPlayers;
};

const getRemovedGame = gamesWithTooFewPlayers => {
  // Get games with least players
  const sortedGamesWithTooFewPlayers = gamesWithTooFewPlayers.sort((a, b) => {
    const keyA = a.players;
    const keyB = b.players;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  // logger.info('sortedGamesWithTooFewPlayers');
  // logger.info(sortedGamesWithTooFewPlayers);

  // Find games that are tied to the lowest player count
  const tiedToLowest = [];
  for (let i = 0; i < sortedGamesWithTooFewPlayers.length; i += 1) {
    if (
      sortedGamesWithTooFewPlayers[i].players ===
      sortedGamesWithTooFewPlayers[0].players
    )
      tiedToLowest.push(sortedGamesWithTooFewPlayers[i]);
    // logger.info(sortedGamesWithTooFewPlayers[i].players);
  }

  // logger.info('tiedToLowest');

  /*
  for (let i = 0; i < tiedToLowest.length; i += 1) {
    logger.info(tiedToLowest[i].players);
  }
  */

  const randomIndex = Math.floor(Math.random() * tiedToLowest.length);
  const removedGame = tiedToLowest[randomIndex].game;

  // logger.info(`Removing game ${removedGame.title}`);

  return removedGame;
};

const buildSignupResults = (results, selectedGames, selectedPlayers) => {
  const signupResults = [];

  // Build signup results
  for (let i = 0; i < results.length; i += 1) {
    // const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    // logger.info(`matrix value: ${matrixValue}`);

    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10);
    // logger.info(`selected row: ${selectedRow}`);

    // Player id
    const selectedPlayer = parseInt(results[i][1], 10);
    // logger.info(`selected player: ${selectedPlayer}`);

    let attendanceRange = 0;

    // Figure what games the row numbers are
    for (let j = 0; j < selectedGames.length; j += 1) {
      let matchingGame;
      attendanceRange += selectedGames[j].max_attendance;

      // logger.info(`attendanceRange: ${attendanceRange}`);

      // Found game
      if (selectedRow < attendanceRange) {
        matchingGame = selectedGames[j];

        signupResults.push({
          username: selectedPlayers[selectedPlayer].username,
          enteredGame: { id: matchingGame.id },
          signedGames: selectedPlayers[selectedPlayer].signed_games,
        });
        break;
      }
    }
  }
  return signupResults;
};

const getPriorities = (results, signupMatrix) => {
  // Show the priorities players were assigned to
  const priorities = [];
  for (let i = 0; i < results.length; i += 1) {
    const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    const selectedPlayer = parseInt(results[i][1], 10);
    priorities.push({ playerId: selectedPlayer, priorityValue: matrixValue });
    // logger.info(`Priority for player ${selectedPlayer}: ${matrixValue}`);
  }
  return priorities;
};

const getPlayersWithTooHighPriority = priorities => {
  const playersWithTooHighPriority = [];

  priorities.forEach(priority => {
    if (priority.priorityValue === 9) {
      playersWithTooHighPriority.push(priority);
      logger.info(`Priority too high for player ${priority.playerId}`);
    }
  });

  return playersWithTooHighPriority;
};

const getRemovedPlayer = playersWithTooHighPriority => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  );
  const removedPlayer = playersWithTooHighPriority[randomIndex];

  // logger.info(`Removing player ${removedPlayer.playerId}`);

  return removedPlayer;
};

/*
const mapUsernamesToIds = (results, selectedGames, selectedPlayers) => {
  const updatedSelectedPlayers = [];

  // Build signup results
  for (let i = 0; i < results.length; i += 1) {
    // Player id
    const selectedPlayer = parseInt(results[i][1], 10);
    const user = selectedPlayers[selectedPlayer];
    updatedSelectedPlayers.push(user);
  }
  return updatedSelectedPlayers;
};
*/

// ******* //
// Main function
// ******* //

const assignPlayers = (players, games, startingTime) => {
  logger.info(
    `Munkres: received data for ${players.length} players and ${games.length} games`
  );

  logger.info(`Assigning players for games starting at ${startingTime}`);

  const startingGames = getStargingGames(games, startingTime);
  const signupWishes = getSignupWishes(players);
  const selectedGames = getSelectedGames(startingGames, signupWishes);
  const selectedPlayers = getSelectedPlayers(players, startingGames);
  let signupMatrix = getSignupMatrix(selectedGames, selectedPlayers);

  const initialGamesCount = selectedGames.length;
  const initialPlayerCount = selectedPlayers.length;
  let removedGamesCount = 0; // eslint-disable-line no-unused-vars
  let removedPlayerCount = 0;

  // logger.info(signupMatrix);

  // Run the algorithm
  // logger.info('run munkres');
  let results = munkres(signupMatrix);
  // logger.info('run munkres finished');

  // logger.info(results);

  let gamesWithTooFewPlayers = checkMinAttendance(results, selectedGames);

  while (gamesWithTooFewPlayers.length > 0) {
    const removedGame = getRemovedGame(gamesWithTooFewPlayers);

    for (let i = 0; i < selectedGames.length; i += 1) {
      if (selectedGames[i].id === removedGame.id) {
        logger.info(`Removed game ${selectedGames[i].title}`);
        selectedGames.splice(i, 1);
        removedGamesCount += 1;
        break;
      }
    }

    signupMatrix = getSignupMatrix(selectedGames, selectedPlayers);
    results = munkres(signupMatrix);
    gamesWithTooFewPlayers = checkMinAttendance(results, selectedGames);
  }

  // Map usernames back to player ids before altering players array
  let priorities = getPriorities(results, signupMatrix);
  let playersWithTooHighPriority = getPlayersWithTooHighPriority(priorities);

  while (playersWithTooHighPriority.length > 0) {
    const removedPlayer = getRemovedPlayer(playersWithTooHighPriority);

    logger.info(`Removed player ${removedPlayer.playerId}`);
    selectedPlayers.splice(removedPlayer.playerId, 1);
    removedPlayerCount += 1;

    signupMatrix = getSignupMatrix(selectedGames, selectedPlayers);
    results = munkres(signupMatrix);
    priorities = getPriorities(results, signupMatrix);
    playersWithTooHighPriority = getPlayersWithTooHighPriority(priorities);
  }

  logger.info(`Removed ${removedGamesCount}/${initialGamesCount} games`);
  logger.info(`Removed ${removedPlayerCount}/${initialPlayerCount} players`);

  const signupResults = buildSignupResults(
    results,
    selectedGames,
    selectedPlayers
  );

  return Promise.resolve(signupResults);
};

module.exports = { assignPlayers };
