import _ from 'lodash';
import { OpaAssignResults } from 'typings/opaAssign.typings';
import { UserArray } from 'typings/user.typings';
import { Result } from 'typings/result.typings';

export const formatResults = (
  assignResults: OpaAssignResults,
  playerGroups: ReadonlyArray<UserArray>
): ReadonlyArray<Result> => {
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
      username: player.username,
      enteredGame: player.signedGames.find(signedGame =>
        assignResults.find(
          assignResult =>
            (assignResult.id === player.groupCode ||
              assignResult.id === player.serial) &&
            assignResult.assignment === signedGame.gameDetails.gameId
        )
      ),
    };
  });
};
