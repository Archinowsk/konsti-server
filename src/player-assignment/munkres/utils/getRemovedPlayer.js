/* @flow */
type PlayeIdWithPriority = { playerId: number, priorityValue: number }

const getRemovedPlayer = (
  playersWithTooHighPriority: $ReadOnlyArray<PlayeIdWithPriority>
) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  )
  const removedPlayer = playersWithTooHighPriority[randomIndex]

  return removedPlayer
}

export default getRemovedPlayer
