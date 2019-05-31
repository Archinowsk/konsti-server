/* @flow */
import logger from 'utils/logger'
import type { User } from 'flow/user.flow'

const getGroupMembers = (
  groupLeaders: Array<User>,
  players: Array<User>
): Array<User> => {
  logger.info('Add group members to groups')

  const selectedPlayersWithSignups = []

  for (let groupLeader of groupLeaders) {
    // Skip individual users
    if (groupLeader.playerGroup !== '0') {
      for (let player of players) {
        // User is in the group but is not the leader
        if (
          player.playerGroup === groupLeader.playerGroup &&
          player.username !== groupLeader.username
        ) {
          // player.signedGames = groupLeader.signedGames
          selectedPlayersWithSignups.push(
            Object.assign({
              ...player,
              signedGames: groupLeader.signedGames,
            })
          )
        }
      }
    }
  }

  logger.info(`Found ${selectedPlayersWithSignups.length} group members`)

  return selectedPlayersWithSignups
}

export default getGroupMembers
