/* @flow */
import moment from 'moment'
import { toPercent } from '../statsUtil'
import { logger } from 'utils/logger'
import type { Game } from 'flow/game.flow'
import type { User } from 'flow/user.flow'

export const getGamesByStartingTime = (games: $ReadOnlyArray<Game>) => {
  const gamesByTime = games.reduce((acc, game) => {
    acc[game.startTime] = ++acc[game.startTime] || 1
    return acc
  }, {})

  logger.info(`Number of games for each start time: \n`, gamesByTime)
  return gamesByTime
}

export const getUsersByGames = (users: $ReadOnlyArray<User>) => {
  const enteredGames = users.reduce((acc, user) => {
    user.enteredGames.forEach(game => {
      acc[game.gameDetails.gameId] = ++acc[game.gameDetails.gameId] || 1
    })
    return acc
  }, {})

  // logger.info(enteredGames)
  return enteredGames
}

export const getNumberOfFullGames = (
  games: $ReadOnlyArray<Game>,
  usersByGames: Object
) => {
  let counter = 0
  games.forEach(game => {
    if (
      parseInt(game.maxAttendance, 10) ===
      parseInt(usersByGames[game.gameId], 10)
    ) {
      counter++
    }
  })

  logger.info(
    `Games with maximum number of players: ${counter}/${
      games.length
    } (${toPercent(counter / games.length)}%)`
  )
}

export const getSignupsByStartTime = (users: $ReadOnlyArray<User>) => {
  const userSignupCountsByTime = {}

  users.forEach(user => {
    const signedGames = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1
      return acc
    }, {})

    for (const signupTime in signedGames) {
      userSignupCountsByTime[signupTime] =
        ++userSignupCountsByTime[signupTime] || 1
    }
  })

  // logger.info(`Total number of signups by time: \n`, userSignupCountsByTime)
  return userSignupCountsByTime
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
  for (const startTime in maximumNumberOfPlayersByTime) {
    logger.info(
      `Demand for ${moment(startTime).format('DD.M.YYYY HH:mm')}: ${
        signupsByTime[startTime]
      }/${maximumNumberOfPlayersByTime[startTime]} (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    )
  }
}
