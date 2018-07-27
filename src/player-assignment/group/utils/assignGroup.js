/* @flow */
import logger from '/utils/logger'
import runAssignment from '/player-assignment/group/utils/runAssignment'
import config from '/config'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

type UserArray = Array<User>

const assignGroups = (
  selectedPlayers: Array<User>,
  selectedGames: Array<Game>,
  playerGroups: Array<UserArray>
) => {
  const { ASSIGNMENT_ROUNDS } = config

  let bestScore = 0
  let players = 0
  let games = 0
  let result = null
  let bestResult = null

  // Run assignment ASSIGNMENT_ROUNDS times
  for (let i = 0; i < ASSIGNMENT_ROUNDS; i++) {
    result = runAssignment(playerGroups, selectedGames)
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
  )}%), Games: ${games}/${selectedGames.length} (${Math.round(
    (games / selectedGames.length) * 100
  )}%)`

  logger.info(returnMessage)

  return { results: bestResult, message: returnMessage }
}

export default assignGroups
