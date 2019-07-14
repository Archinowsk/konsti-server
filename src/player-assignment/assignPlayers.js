/* @flow */
import { logger } from 'utils/logger'
import { groupAssignPlayers } from 'player-assignment/group/groupAssignPlayers'
import { munkresAssignPlayers } from 'player-assignment/munkres/munkresAssignPlayers'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { AssignResult } from 'flow/result.flow'
import type { AssignmentStrategy } from 'flow/config.flow'

export const assignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: string,
  assignmentStrategy: AssignmentStrategy
): AssignResult => {
  logger.info(
    `Received data for ${players.length} players and ${games.length} games`
  )

  logger.info(
    `Assigning players for games starting at ${startingTime.toString()}`
  )

  logger.info(`Assign strategy: ${assignmentStrategy}`)

  if (assignmentStrategy === 'munkres') {
    return munkresAssignPlayers(players, games, startingTime)
  } else if (assignmentStrategy === 'group') {
    return groupAssignPlayers(players, games, startingTime)
  } else {
    throw new Error('Invalid or missing "assignmentStrategy" config')
  }
}
