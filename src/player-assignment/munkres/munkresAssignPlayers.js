/* @flow */
import munkres from 'munkres-js'
import logger from 'utils/logger'
import getStartingGames from 'player-assignment/utils/getStartingGames'
import getSignupWishes from 'player-assignment/utils/getSignupWishes'
import getSelectedGames from 'player-assignment/utils/getSelectedGames'
import getSelectedPlayers from 'player-assignment/utils/getSelectedPlayers'
import getSignupMatrix from 'player-assignment/munkres/utils/getSignupMatrix'
import checkMinAttendance from 'player-assignment/munkres/utils/checkMinAttendance'
import getRemovedGame from 'player-assignment/munkres/utils/getRemovedGame'
import getPriorities from 'player-assignment/munkres/utils/getPriorities'
import getPlayersWithTooHighPriority from 'player-assignment/munkres/utils/getPlayersWithTooHighPriority'
import getRemovedPlayer from 'player-assignment/munkres/utils/getRemovedPlayer'
import buildSignupResults from 'player-assignment/munkres/utils/buildSignupResults'
import type { User, SignupResult } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

const munkresAssignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date
): Array<SignupResult> => {
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
        logger.info(`Removed game "${selectedGames[i].title}"`)
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
