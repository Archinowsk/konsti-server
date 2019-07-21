/* @flow */
import _ from 'lodash'
import { logger } from 'utils/logger'
import { calculateHappiness } from 'player-assignment/opa/utils/calculateHappiness'
import { getGroups } from 'player-assignment/opa/utils/getGroups'
import type { Result } from 'flow/result.flow'
import type { User, UserArray } from 'flow/user.flow'

export const getHappiness = (
  results: $ReadOnlyArray<Result>,
  playerGroups: $ReadOnlyArray<UserArray>,
  allPlayers: $ReadOnlyArray<User>,
  startingTime: string
): void => {
  const opaAssignment = results.map(result => {
    const player = allPlayers.find(
      player => player.username === result.username
    )

    if (!player) throw new Error('Error calculating assignment happiness')

    return {
      id: player.groupCode !== '0' ? player.groupCode : player.serial,
      assignment: result.enteredGame.gameDetails.gameId,
    }
  })

  const groups = getGroups(playerGroups, startingTime)
  const happiness = calculateHappiness(_.uniqBy(opaAssignment, 'id'), groups)
  logger.info(`Group assignment completed with happiness ${happiness}%`)
}
