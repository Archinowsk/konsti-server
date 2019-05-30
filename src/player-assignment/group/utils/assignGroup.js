/* @flow */
import logger from 'utils/logger'
import runAssignment from 'player-assignment/group/utils/runAssignment'
import config from 'config'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Result } from 'flow/result.flow'

type UserArray = Array<User>

type ResultsWithMessage = {
  results: Array<Result>,
  message: string,
}

const assignGroups = (
  selectedPlayers: Array<User>,
  signedGames: Array<Game>,
  playerGroups: Array<UserArray>
): ResultsWithMessage => {
  const { ASSIGNMENT_ROUNDS } = config

  let bestScore = 0
  let players = 0
  let games = 0
  let result = []
  let bestResult = []

  // Run assignment ASSIGNMENT_ROUNDS times
  for (let i = 0; i < ASSIGNMENT_ROUNDS; i++) {
    result = runAssignment(playerGroups, signedGames)
    if (result.score > bestScore) {
      bestScore = result.score
      bestResult = result.signupResults
      players = result.players
      games = result.games
      logger.info(`New best score: ${bestScore}`)
    }
  }

  const returnMessage = `Final result - Players: score ${bestScore}, number ${players}/${
    selectedPlayers.length
  } (${Math.round(
    (players / selectedPlayers.length) * 100
  )}%), Games: ${games}/${signedGames.length} (${Math.round(
    (games / signedGames.length) * 100
  )}%)`

  logger.info(returnMessage)

  return { results: bestResult, message: returnMessage }
}

export default assignGroups
