/* @flow */
import { toPercent } from '../statsUtil'
import { logger } from 'utils/logger'
import type { Game } from 'flow/game.flow'

export const getSignupsByTime = (results: $ReadOnlyArray<any>) => {
  const signupsByTime = results.reduce((acc, result) => {
    acc[result.startTime] = result.result.length
    return acc
  }, {})

  /*
  logger.info(
    `Number of people entering to games by starting times: \n`,
    signupsByTime
  )
  */

  return signupsByTime
}

export const getMaximumNumberOfPlayersByTime = (
  games: $ReadOnlyArray<Game>
) => {
  const maxNumberOfPlayersByTime = {}
  games.forEach(game => {
    if (!maxNumberOfPlayersByTime[game.startTime]) {
      maxNumberOfPlayersByTime[game.startTime] = 0
    }

    maxNumberOfPlayersByTime[game.startTime] =
      parseInt(maxNumberOfPlayersByTime[game.startTime], 10) +
      parseInt(game.maxAttendance, 10)
  })

  /*
  logger.info(
    `Maximum number of seats by starting times: \n`,
    maxNumberOfPlayersByTime
  )
  */
  return maxNumberOfPlayersByTime
}

export const getDemandByTime = (
  signupsByTime: Object,
  maximumNumberOfPlayersByTime: Object
) => {
  logger.info('Sanity check: values over 100% are anomalies')
  for (const startTime in maximumNumberOfPlayersByTime) {
    logger.info(
      `Signed people for ${startTime}: ${signupsByTime[startTime]}/${
        maximumNumberOfPlayersByTime[startTime]
      } (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    )
  }
}
