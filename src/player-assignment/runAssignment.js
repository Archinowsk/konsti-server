// @flow
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { config } from 'config';
import { runAssignmentStrategy } from 'player-assignment/utils/runAssignmentStrategy';
import { removeInvalidSignupsFromUsers } from 'player-assignment/utils/removeInvalidSignupsFromUsers';
import type { PlayerAssignmentResult } from 'flow/result.flow';
import type { User } from 'flow/user.flow';
import type { Game } from 'flow/game.flow';
import type { AssignmentStrategy } from 'flow/config.flow';

export const runAssignment = async (
  startingTime: string,
  assignmentStrategy: AssignmentStrategy = config.assignmentStrategy
): Promise<PlayerAssignmentResult> => {
  const [error] = await to(removeInvalidSignupsFromUsers());
  if (error) throw new Error(`Error removing invalid games: ${error}`);

  let users: $ReadOnlyArray<User> = [];
  try {
    users = await db.user.findUsers();
  } catch (error) {
    throw new Error(`findUsers error: ${error}`);
  }

  let games: $ReadOnlyArray<Game> = [];
  try {
    games = await db.game.findGames();
  } catch (error) {
    logger.error(`findGames error: ${error}`);
    throw new Error(`findGames error: ${error}`);
  }

  let assignResults = null;
  try {
    assignResults = runAssignmentStrategy(
      users,
      games,
      startingTime,
      assignmentStrategy
    );
  } catch (error) {
    throw new Error(`Player assign error: ${error}`);
  }

  return assignResults;
};
