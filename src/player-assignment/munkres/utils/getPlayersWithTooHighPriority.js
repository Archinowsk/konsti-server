/* @flow */
import { logger } from 'utils/logger'
import type { PlayeIdWithPriority } from 'flow/user.flow'

export const getPlayersWithTooHighPriority = (
  priorities: $ReadOnlyArray<PlayeIdWithPriority>
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
