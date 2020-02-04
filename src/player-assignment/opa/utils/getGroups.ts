import moment from 'moment';
import _ from 'lodash';
import { UserArray } from 'typings/user.typings';
import { Group } from 'typings/opaAssign.typings';

export const getGroups = (
  playerGroups: readonly UserArray[],
  startingTime: string
): Group[] => {
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
