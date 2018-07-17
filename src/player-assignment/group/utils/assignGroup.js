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
  let result = null
  let bestResult = null

  // Run assignment ASSIGNMENT_ROUNDS times
  for (let i = 0; i < ASSIGNMENT_ROUNDS; i++) {
    result = runAssignment(playerGroups, selectedGames)
    if (result.score > bestScore) {
      bestScore = result.score
      bestResult = result.signupResults
      logger.info(`New best score: ${bestScore}`)
    }
  }

  logger.info(
    `Final result - Players: ${bestScore}/${
      selectedPlayers.length
    } (${Math.round(
      (bestScore / selectedPlayers.length) * 100
    )}%), Games: <TODO>`
  )

  return bestResult
}

export default assignGroups
