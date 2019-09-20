// @flow
import type { PlayeIdWithPriority } from 'flow/user.flow'

export const getRemovedPlayer = (
  playersWithTooHighPriority: $ReadOnlyArray<PlayeIdWithPriority>
) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  )
  const removedPlayer = playersWithTooHighPriority[randomIndex]

  return removedPlayer
}
