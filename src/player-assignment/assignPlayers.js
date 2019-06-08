/* @flow */
import logger from 'utils/logger'
import groupAssignPlayers from 'player-assignment/group/groupAssignPlayers'
import munkresAssignPlayers from 'player-assignment/munkres/munkresAssignPlayers'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { AssignResult } from 'flow/result.flow'

const assignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: Date,
  strategy: string
): AssignResult => {
  logger.info(
    `Received data for ${players.length} players and ${games.length} games`
  )

  logger.info(
    `Assigning players for games starting at ${startingTime.toString()}`
  )

  logger.info(`Assign strategy: ${strategy}`)

  if (strategy === 'munkres') {
    return munkresAssignPlayers(players, games, startingTime)
  } else if (strategy === 'group') {
    return groupAssignPlayers(players, games, startingTime)
  } else {
    throw new Error('Invalid or missing "assignmentStrategy" config')
  }
}

export default assignPlayers
