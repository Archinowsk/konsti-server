/* @flow */
import munkres from 'munkres-js'
import { logger } from '../../utils/logger'

import getStartingGames from './utils/getStartingGames'
import getSignupWishes from './utils/getSignupWishes'
import getSelectedGames from './utils/getSelectedGames'
import getSelectedPlayers from './utils/getSelectedPlayers'
import getSignupMatrix from './utils/getSignupMatrix'
import checkMinAttendance from './utils/checkMinAttendance'
import getRemovedGame from './utils/getRemovedGame'
import getPriorities from './utils/getPriorities'
import getPlayersWithTooHighPriority from './utils/getPlayersWithTooHighPriority'
import getRemovedPlayer from './utils/getRemovedPlayer'
import buildSignupResults from './utils/buildSignupResults'

const munkresAssignPlayers = (
  players: Array<Object>,
  games: Array<Object>,
  startingTime: Date
) => {
  logger.info(`Munkres strategy`)

  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)
  const signupMatrix = getSignupMatrix(selectedGames, selectedPlayers)

  const initialGamesCount = selectedGames.length
  const initialPlayerCount = selectedPlayers.length
  let removedGamesCount = 0
  let removedPlayerCount = 0

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

  return signupResults
}

export default munkresAssignPlayers
