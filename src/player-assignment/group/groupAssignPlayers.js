/* @flow */
import { logger } from '../../utils/logger'

const groupAssignPlayers = (
  players: Array<Object>,
  games: Array<Object>,
  startingTime: Date
) => {
  logger.info(`Group strategy`)

  const signupResults = null
  // TODO: Should this be a promise?
  // return Promise.resolve(signupResults)
  return signupResults
}

export default groupAssignPlayers
