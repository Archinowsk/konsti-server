// @flow
import _ from 'lodash';
import type { OpaAssignResults } from 'flow/opaAssign.flow';
import type { UserArray } from 'flow/user.flow';
import type { Result } from 'flow/result.flow';

export const formatResults = (
  assignResults: OpaAssignResults,
  playerGroups: $ReadOnlyArray<UserArray>
): $ReadOnlyArray<Result> => {
  const selectedPlayers = playerGroups
    .filter(playerGroup => {
      return assignResults.find(
        assignResult =>
          (assignResult.id === _.first(playerGroup).groupCode ||
            assignResult.id === _.first(playerGroup).serial) &&
          assignResult.assignment !== -1
      );
    })
    .flat();

  return selectedPlayers.map(player => {
    return {
      // $FlowFixMe: Cannot get `player.username` because property `username` is missing in mixed [1].
      username: player.username,
      // $FlowFixMe: Cannot get `player.signedGames` because property `signedGames` is missing in mixed [1].
      enteredGame: player.signedGames.find(signedGame =>
        assignResults.find(
          assignResult =>
            // $FlowFixMe: Cannot get `player.groupCode` because property `groupCode` is missing in mixed [1].
            (assignResult.id === player.groupCode ||
              // $FlowFixMe: Cannot get `player.serial` because property `serial` is missing in mixed [1].
              assignResult.id === player.serial) &&
            assignResult.assignment === signedGame.gameDetails.gameId
        )
      ),
    };
  });
};
