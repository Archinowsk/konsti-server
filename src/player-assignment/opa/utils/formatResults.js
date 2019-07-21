/* @flow */
import _ from 'lodash'
import type { OpaAssignResults } from 'flow/opaAssign.flow'
import type { UserArray } from 'flow/user.flow'

export const formatResults = (
  assignResults: OpaAssignResults,
  playerGroups: $ReadOnlyArray<UserArray>
) => {
  const selectedPlayers = playerGroups
    .filter(playerGroup => {
      return assignResults.find(
        assignResult =>
          (assignResult.id === _.first(playerGroup).groupCode ||
            assignResult.id === _.first(playerGroup).serial) &&
          assignResult.assignment !== -1
      )
    })
    // $FlowFixMe: Cannot call `playerGroups.filter(...).flat` because property `flat` is missing in `Array` [1].
    .flat()

  return selectedPlayers.map(player => {
    return {
      username: player.username,
      enteredGame: player.signedGames.find(signedGame =>
        assignResults.find(
          assignResult =>
            (assignResult.id === player.groupCode ||
              assignResult.id === player.serial) &&
            assignResult.assignment === signedGame.gameDetails.gameId
        )
      ),
    }
  })
}
