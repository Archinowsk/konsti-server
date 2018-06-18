/* @flow */
// import { logger } from '../../../utils/logger'

const getRemovedPlayer = (playersWithTooHighPriority: Array<Object>) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  )
  const removedPlayer = playersWithTooHighPriority[randomIndex]

  // logger.info(`Removing player ${removedPlayer.playerId}`);

  return removedPlayer
}

export default getRemovedPlayer
