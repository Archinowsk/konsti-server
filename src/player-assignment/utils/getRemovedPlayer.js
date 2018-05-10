// const { logger } = require('../../utils/logger')

const getRemovedPlayer = playersWithTooHighPriority => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  )
  const removedPlayer = playersWithTooHighPriority[randomIndex]

  // logger.info(`Removing player ${removedPlayer.playerId}`);

  return removedPlayer
}

module.exports = getRemovedPlayer
