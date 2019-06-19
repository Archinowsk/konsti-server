/* @flow */
import type { User, UserArray } from 'flow/user.flow'

export const getPlayerGroups = (
  players: $ReadOnlyArray<User>
): $ReadOnlyArray<UserArray> => {
  // Group all unique group numbers
  const groupedUsers = players.reduce((acc, player) => {
    acc[player['playerGroup']] = acc[player['playerGroup']] || []
    acc[player['playerGroup']].push(player)
    return acc
  }, {})

  const playersArray = []
  for (const [key, value] of Object.entries(groupedUsers)) {
    if (Array.isArray(value)) {
      if (key === '0') {
        // Loop array and add players individually
        for (let i = 0; i < value.length; i++) {
          playersArray.push([value[i]])
        }
      } else {
        playersArray.push(value)
      }
    }
  }

  // $FlowFixMe
  return playersArray
}
