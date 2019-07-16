/* @flow */
import munkres from 'munkres-js'
import { logger } from 'utils/logger'
import { getStartingGames } from 'player-assignment/utils/getStartingGames'
import { getSignupWishes } from 'player-assignment/utils/getSignupWishes'
import { getSignedGames } from 'player-assignment/utils/getSignedGames'
import { getSelectedPlayers } from 'player-assignment/utils/getSelectedPlayers'
import { getSignupMatrix } from 'player-assignment/munkres/utils/getSignupMatrix'
import { checkMinAttendance } from 'player-assignment/munkres/utils/checkMinAttendance'
import { getRemovedGame } from 'player-assignment/munkres/utils/getRemovedGame'
import { getPriorities } from 'player-assignment/munkres/utils/getPriorities'
import { getPlayersWithTooHighPriority } from 'player-assignment/munkres/utils/getPlayersWithTooHighPriority'
import { getRemovedPlayer } from 'player-assignment/munkres/utils/getRemovedPlayer'
import { buildSignupResults } from 'player-assignment/munkres/utils/buildSignupResults'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { PlayerAssignmentResult } from 'flow/result.flow'

export const munkresAssignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: string
): PlayerAssignmentResult => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const signedGames = getSignedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)
  const signupMatrix = getSignupMatrix(signedGames, selectedPlayers)

  const initialGamesCount = signedGames.length
  const initialPlayerCount = selectedPlayers.length
  let removedGamesCount = 0
  let removedPlayerCount = 0

  // Run the algorithm
  let results = munkres(signupMatrix)

  let gamesWithTooFewPlayers = checkMinAttendance(results, signedGames)

  while (gamesWithTooFewPlayers.length > 0) {
    const removedGame = getRemovedGame(gamesWithTooFewPlayers)

    for (let i = 0; i < signedGames.length; i += 1) {
      if (signedGames[i].gameId === removedGame.gameId) {
        logger.info(`Removed game "${signedGames[i].title}"`)
        signedGames.splice(i, 1)
        removedGamesCount += 1
        break
      }
    }

    results = munkres(signupMatrix)
    gamesWithTooFewPlayers = checkMinAttendance(results, signedGames)
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
    signedGames,
    selectedPlayers
  )

  const message = 'Munkres assignment completed'

  return { results: signupResults, message, newSignupData: [] }
}
