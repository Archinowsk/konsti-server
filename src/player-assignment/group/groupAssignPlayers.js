// @flow
import { logger } from 'utils/logger';
import { getStartingGames } from 'player-assignment/utils/getStartingGames';
import { getSignupWishes } from 'player-assignment/utils/getSignupWishes';
import { getSignedGames } from 'player-assignment/utils/getSignedGames';
import { getSelectedPlayers } from 'player-assignment/utils/getSelectedPlayers';
import { assignGroups } from 'player-assignment/group/utils/assignGroup';
import { getPlayerGroups } from 'player-assignment/utils/getPlayerGroups';
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups';
import { getGroupMembers } from 'player-assignment/utils/getGroupMembers';
import { getHappiness } from 'player-assignment/group/utils/getHappiness';
import type { User } from 'flow/user.flow';
import type { Game } from 'flow/game.flow';
import type { PlayerAssignmentResult } from 'flow/result.flow';

export const groupAssignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: string
): PlayerAssignmentResult => {
  logger.debug(`***** Run Group Assignment for ${startingTime}`);
  const startingGames = getStartingGames(games, startingTime);

  if (startingGames.length === 0) {
    logger.info('No starting games, stop!');
    return {
      results: [],
      message: 'Group Assign Result - No starting games',
      newSignupData: [],
      algorithm: 'group',
      status: 'error: no starting games',
    };
  }

  const signupWishes = getSignupWishes(players);

  if (signupWishes.length === 0) {
    logger.info('No signup wishes, stop!');
    return {
      results: [],
      message: 'Group Assign Result - No signup wishes',
      newSignupData: [],
      algorithm: 'group',
      status: 'error: no signup wishes',
    };
  }

  const signedGames = getSignedGames(startingGames, signupWishes);

  // Selected players are group leaders since group members don't have signups at this point
  const groupLeaders = getSelectedPlayers(players, startingGames);
  const groupMembers = getGroupMembers(groupLeaders, players);
  const allPlayers = groupLeaders.concat(groupMembers);
  // Single user is size 1 group
  const playerGroups = getPlayerGroups(allPlayers);

  let numberOfIndividuals = 0;
  let numberOfGroups = 0;
  for (const playerGroup of playerGroups) {
    if (playerGroup.length > 1) {
      numberOfGroups += 1;
    } else {
      numberOfIndividuals += 1;
    }
  }

  logger.debug(`Games with signups: ${signedGames.length}`);
  logger.debug(
    `Selected players: ${allPlayers.length} (${numberOfIndividuals} individual, ${numberOfGroups} groups)`
  );

  const result = assignGroups(allPlayers, signedGames, playerGroups);

  getHappiness(result.results, playerGroups, allPlayers, startingTime);

  const newSignupData = removeOverlapSignups(result.results, players);

  logger.debug(`${result.message}`);

  return Object.assign({
    ...result,
    newSignupData,
    algorithm: 'group',
    status: 'success',
  });
};
