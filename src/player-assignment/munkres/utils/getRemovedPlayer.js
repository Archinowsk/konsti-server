/* @flow */
const getRemovedPlayer = (playersWithTooHighPriority: Array<Object>) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  )
  const removedPlayer = playersWithTooHighPriority[randomIndex]

  return removedPlayer
}

export default getRemovedPlayer
