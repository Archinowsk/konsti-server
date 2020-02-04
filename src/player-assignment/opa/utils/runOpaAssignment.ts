import { assignOpa } from 'player-assignment/opa/utils/assignOpa';
import { getGroups } from 'player-assignment/opa/utils/getGroups';
import { getList } from 'player-assignment/opa/utils/getList';
import { getEvents } from 'player-assignment/opa/utils/getEvents';
import { formatResults } from 'player-assignment/opa/utils/formatResults';
import { AssignmentStrategyResult } from 'typings/result.typings';
import { UserArray } from 'typings/user.typings';
import { Game } from 'typings/game.typings';

export const runOpaAssignment = (
  signedGames: readonly Game[],
  playerGroups: readonly UserArray[],
  startingTime: string
): AssignmentStrategyResult => {
  const groups = getGroups(playerGroups, startingTime);
  const events = getEvents(signedGames);
  const list = getList(playerGroups, startingTime);
  const updateL = input => input.list;

  const assignResults = assignOpa(groups, events, list, updateL);

  if (!assignResults) {
    throw new Error('Opa assignment error');
  }

  const results = formatResults(assignResults, playerGroups);

  const message = 'Opa assignment completed';

  return { results, message };
};
