/* @flow */
import { logger } from '../../../utils/logger'

const getSelectedPlayers = (
  players: Array<Object>,
  startingGames: Array<Object>
) => {
  // Get users who have wishes for valid games
  const selectedPlayers = []

  players.forEach(player => {
    let match = false
    for (let i = 0; i < player.signedGames.length; i += 1) {
      for (let j = 0; j < startingGames.length; j += 1) {
        if (player.signedGames[i].id === startingGames[j].id) {
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
