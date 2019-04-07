/* @flow */
import logger from 'utils/logger'
import config from 'config'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

const getSelectedPlayers = (
  players: Array<User>,
  startingGames: Array<Game>
) => {
  const strategy = config.assignmentStrategy

  if (strategy === 'munkres') {
    logger.info('Get selected players')
  } else if (strategy === 'group') {
    logger.info('Get selected group leaders')
  }

  // Get users who have wishes for valid games
  const selectedPlayers: Array<User> = []

  players.forEach(player => {
    let match = false
    for (let i = 0; i < player.signedGames.length; i += 1) {
      for (let j = 0; j < startingGames.length; j += 1) {
        if (player.signedGames[i].gameId === startingGames[j].gameId) {
          match = true
          break
        }
      }
      // Player matched, break
      if (match) {
        selectedPlayers.push(player)
        break
      }
    }
  })

  if (strategy === 'munkres') {
    logger.info(
      `Found ${selectedPlayers.length} players for this starting time`
    )
  } else if (strategy === 'group') {
    logger.info(
      `Found ${selectedPlayers.length} group leaders for this starting time`
    )
  }

  return selectedPlayers
}

export default getSelectedPlayers
