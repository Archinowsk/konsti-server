const munkres = require('munkres-js')
const { logger } = require('../utils/logger')

const getStartingGames = require('./utils/getStartingGames')
const getSignupWishes = require('./utils/getSignupWishes')
const getSelectedGames = require('./utils/getSelectedGames')
const getSelectedPlayers = require('./utils/getSelectedPlayers')
const getSignupMatrix = require('./utils/getSignupMatrix')
const checkMinAttendance = require('./utils/checkMinAttendance')
const getRemovedGame = require('./utils/getRemovedGame')
const getPriorities = require('./utils/getPriorities')
const getPlayersWithTooHighPriority = require('./utils/getPlayersWithTooHighPriority')
const getRemovedPlayer = require('./utils/getRemovedPlayer')
const buildSignupResults = require('./utils/buildSignupResults')

const assignPlayers = (players, games, startingTime) => {
  logger.info(
    `Munkres: received data for ${players.length} players and ${
      games.length
    } games`
  )

  logger.info(`Assigning players for games starting at ${startingTime}`)

  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)
  const signupMatrix = getSignupMatrix(selectedGames, selectedPlayers)

  const initialGamesCount = selectedGames.length
  const initialPlayerCount = selectedPlayers.length
  let removedGamesCount = 0
  let removedPlayerCount = 0

  logger.info(signupMatrix)

  // Run the algorithm
  let results = munkres(signupMatrix)

  let gamesWithTooFewPlayers = checkMinAttendance(results, selectedGames)

  while (gamesWithTooFewPlayers.length > 0) {
    const removedGame = getRemovedGame(gamesWithTooFewPlayers)

    for (let i = 0; i < selectedGames.length; i += 1) {
      if (selectedGames[i].id === removedGame.id) {
        logger.info(`Removed game ${selectedGames[i].title}`)
        selectedGames.splice(i, 1)
        removedGamesCount += 1
        break
      }
    }

    // signupMatrix = getSignupMatrix(selectedGames, selectedPlayers)
    results = munkres(signupMatrix)
    gamesWithTooFewPlayers = checkMinAttendance(results, selectedGames)
  }

  // Map usernames back to player IDs before altering players array
  let priorities = getPriorities(results, signupMatrix)
  let playersWithTooHighPriority = getPlayersWithTooHighPriority(priorities)

  while (playersWithTooHighPriority.length > 0) {
    const removedPlayer = getRemovedPlayer(playersWithTooHighPriority)

    logger.info(`Removed player ${removedPlayer.playerId}`)
    selectedPlayers.splice(removedPlayer.playerId, 1)
    removedPlayerCount += 1

    results = munkres(signupMatrix)
    priorities = getPriorities(results, signupMatrix)
    playersWithTooHighPriority = getPlayersWithTooHighPriority(priorities)
  }

  logger.info(`Removed ${removedGamesCount}/${initialGamesCount} games`)
  logger.info(`Removed ${removedPlayerCount}/${initialPlayerCount} players`)

  const signupResults = buildSignupResults(
    results,
    selectedGames,
    selectedPlayers
  )

  return Promise.resolve(signupResults)
}

module.exports = assignPlayers
