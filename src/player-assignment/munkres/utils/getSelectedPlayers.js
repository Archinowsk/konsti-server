const { logger } = require('../../../utils/logger')

const getSelectedPlayers = (players, startingGames) => {
  // Get users who have wishes for valid games
  const selectedPlayers = []

  players.forEach(player => {
    let match = false
    for (let i = 0; i < player.signed_games.length; i += 1) {
      for (let j = 0; j < startingGames.length; j += 1) {
        if (player.signed_games[i].id === startingGames[j].id) {
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

module.exports = getSelectedPlayers
