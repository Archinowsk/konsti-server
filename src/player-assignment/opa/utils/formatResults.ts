import _ from 'lodash';
import { OpaAssignResults } from 'typings/opaAssign.typings';
import { UserArray } from 'typings/user.typings';
import { Result } from 'typings/result.typings';

export const formatResults = (
  assignResults: OpaAssignResults,
  playerGroups: readonly UserArray[]
): readonly Result[] => {
  const selectedPlayers = playerGroups
    .filter(playerGroup => {
      const firstMember = _.first(playerGroup);
      if (!firstMember)
        throw new Error('Opa assign: error getting first member');
      return assignResults.find(
        assignResult =>
          (assignResult.id === firstMember.groupCode ||
            assignResult.id === firstMember.serial) &&
          // @ts-ignore
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
