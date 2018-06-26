/* @flow */
import { logger } from '../utils/logger'
import groupAssignPlayers from './group/groupAssignPlayers'
import munkresAssignPlayers from './munkres/munkresAssignPlayers'
import type { User } from '../flow/user.flow'
import type { Game } from '../flow/game.flow'

const assignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date,
  strategy: string
) => {
  logger.info(
    `Received data for ${players.length} players and ${games.length} games`
  )

  logger.info(
    `Assigning players for games starting at ${startingTime.toString()}`
  )

  logger.info(`Assign strategy: ${strategy}`)

  let result = null
  if (strategy === 'munkres') {
    result = munkresAssignPlayers(players, games, startingTime)
  } else if (strategy === 'group') {
    result = groupAssignPlayers(players, games, startingTime)
  }

  return result
}

export default assignPlayers
