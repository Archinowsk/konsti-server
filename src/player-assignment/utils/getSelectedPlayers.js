/* @flow */
import logger from 'utils/logger'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

const getSelectedPlayers = (
  players: Array<User>,
  startingGames: Array<Game>
): Array<User> => {
  logger.debug('Get selected players')

  // Get users who have wishes for starting games
  const selectedPlayers = []

  players.forEach(player => {
    let match = false
    for (let i = 0; i < player.signedGames.length; i += 1) {
      for (let j = 0; j < startingGames.length; j += 1) {
        if (
          player.signedGames[i].gameDetails.gameId === startingGames[j].gameId
        ) {
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

  logger.info(`Found ${selectedPlayers.length} players for this starting time`)

  return selectedPlayers
}

export default getSelectedPlayers
