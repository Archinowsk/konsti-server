/* @flow */
import logger from 'utils/logger'
type PlayeIdWithPriority = { playerId: number, priorityValue: number }

const getPlayersWithTooHighPriority = (
  priorities: Array<PlayeIdWithPriority>
) => {
  const playersWithTooHighPriority = []

  priorities.forEach(priority => {
    if (priority.priorityValue === 9) {
      playersWithTooHighPriority.push(priority)
      logger.info(`Priority too high for player ${priority.playerId}`)
    }
  })

  return playersWithTooHighPriority
}

export default getPlayersWithTooHighPriority
