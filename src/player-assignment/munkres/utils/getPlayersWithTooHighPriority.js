const { logger } = require('../../../utils/logger')

const getPlayersWithTooHighPriority = priorities => {
  const playersWithTooHighPriority = []

  priorities.forEach(priority => {
    if (priority.priorityValue === 9) {
      playersWithTooHighPriority.push(priority)
      logger.info(`Priority too high for player ${priority.playerId}`)
    }
  })

  return playersWithTooHighPriority
}

module.exports = getPlayersWithTooHighPriority
