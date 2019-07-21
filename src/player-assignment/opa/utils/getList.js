/* @flow */
import _ from 'lodash'
import moment from 'moment'
import type { ListItem } from 'flow/opaAssign.flow'
import type { UserArray, SignedGame } from 'flow/user.flow'

export const getList = (
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): Array<ListItem> => {
  return playerGroups.flatMap(playerGroup => {
    return _.first(playerGroup)
      .signedGames.filter(
        signedGame =>
          moment(signedGame.time).format() === moment(startingTime).format()
      )
      .map(signedGame => {
        return {
          id:
            _.first(playerGroup).groupCode !== '0'
              ? _.first(playerGroup).groupCode
              : _.first(playerGroup).serial,
          size: playerGroup.length,
          event: signedGame.gameDetails.gameId,
          gain: getGain(signedGame),
        }
      })
  })
}

const getGain = (signedGame: SignedGame) => {
  switch (signedGame.priority) {
    case 1:
      return 1
    case 2:
      return 0.5
    case 3:
      return 0.33
  }

  throw new Error(`Invalid signup priority: ${signedGame.priority}`)
}
