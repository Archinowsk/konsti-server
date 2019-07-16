/* @flow */
import { logger } from 'utils/logger'
import { runGroupAssignment } from 'player-assignment/group/utils/runGroupAssignment'
import { config } from 'config'
import type { User, UserArray } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { AssignmentStrategyResult } from 'flow/result.flow'

export const assignGroups = (
  selectedPlayers: $ReadOnlyArray<User>,
  signedGames: $ReadOnlyArray<Game>,
  playerGroups: $ReadOnlyArray<UserArray>
): AssignmentStrategyResult => {
  const { ASSIGNMENT_ROUNDS } = config

  let bestScore = 0
  let players = 0
  let games = 0
  let result = []
  let bestResult = []

  // Run assignment ASSIGNMENT_ROUNDS times
  for (let i = 0; i < ASSIGNMENT_ROUNDS; i++) {
    result = runGroupAssignment(playerGroups, signedGames)
    if (result.score > bestScore) {
      bestScore = result.score
      bestResult = result.signupResults
      players = result.playerCounter
      games = result.gameCounter
      logger.info(`New best score: ${bestScore}`)
    }
  }

  const returnMessage = `Result - Score: ${bestScore}, Players: ${players}/${
    selectedPlayers.length
  } (${Math.round(
    (players / selectedPlayers.length) * 100
  )}%), Games: ${games}/${signedGames.length} (${Math.round(
    (games / signedGames.length) * 100
  )}%)`

  logger.info(returnMessage)

  return { results: bestResult, message: returnMessage }
}
