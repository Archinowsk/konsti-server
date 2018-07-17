/* @flow */
import logger from '/utils/logger'
import getPlayerGroups from '/player-assignment/group/utils/getPlayerGroups'
import runAssignment from '/player-assignment/group/utils/runAssignment'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

const assignGroups = (
  selectedPlayers: Array<User>,
  selectedGames: Array<Game>
) => {
  const playerGroups = getPlayerGroups(selectedPlayers)
  const rounds = 10000
  let bestScore = 0
  let result = null
  let bestResult = null

  for (let i = 0; i < rounds; i++) {
    result = runAssignment(playerGroups, selectedGames)
    if (result.score > bestScore) {
      bestScore = result.score
      bestResult = result.signupResults
      logger.info(`New best score: ${bestScore}`)
    }
  }

  logger.info(
    `Final score: ${bestScore}/${selectedPlayers.length} (${(bestScore /
      selectedPlayers.length) *
      100}%)`
  )

  return bestResult
}

export default assignGroups
