// @flow
import { logger } from 'utils/logger'
import { groupAssignPlayers } from 'player-assignment/group/groupAssignPlayers'
import { munkresAssignPlayers } from 'player-assignment/munkres/munkresAssignPlayers'
import { opaAssignPlayers } from 'player-assignment/opa/opaAssignPlayers'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { PlayerAssignmentResult } from 'flow/result.flow'
import type { AssignmentStrategy } from 'flow/config.flow'

export const assignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: string,
  assignmentStrategy: AssignmentStrategy
): PlayerAssignmentResult => {
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
  } else if (assignmentStrategy === 'opa') {
    return opaAssignPlayers(players, games, startingTime)
  } else if (assignmentStrategy === 'group+opa') {
    const groupResult = groupAssignPlayers(players, games, startingTime)
    const opaResult = opaAssignPlayers(players, games, startingTime)

    logger.info(
      `Group result: ${groupResult.results.length} players, Opa result: ${opaResult.results.length} players`
    )

    if (groupResult.results.length > opaResult.results.length) {
      logger.info('----> Use Group Assign result')
      return groupResult
    } else {
      logger.info('----> Use Opa Assign result')
      return opaResult
    }
  } else {
    throw new Error('Invalid or missing "assignmentStrategy" config')
  }
}
