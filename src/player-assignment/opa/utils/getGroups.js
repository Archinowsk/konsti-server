// @flow
import moment from 'moment';
import _ from 'lodash';
import type { UserArray } from 'flow/user.flow';
import type { Group } from 'flow/opaAssign.flow';

export const getGroups = (
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): Array<Group> => {
  return playerGroups.map(playerGroup => {
    return {
      id:
        _.first(playerGroup).groupCode !== '0'
          ? _.first(playerGroup).groupCode
          : _.first(playerGroup).serial,
      size: playerGroup.length,
      pref: _.first(playerGroup)
        .signedGames.filter(
          signedGame =>
            moment(signedGame.time).format() === moment(startingTime).format()
        )
        .map(signedGame => signedGame.gameDetails.gameId),
    };
  });
};
