import moment from 'moment'
import { toPercent } from '../statsUtil'

export const getGamesByStartingTime = games => {
  const gamesByTime = games.reduce((acc, game) => {
    acc[game.startTime] = ++acc[game.startTime] || 1
    return acc
  }, {})

  console.log(`Number of games for each start time: \n`, gamesByTime)
  return gamesByTime
}

export const getUsersByGames = users => {
  const enteredGames = users.reduce((acc, user) => {
    user.enteredGames.forEach(game => {
      acc[game.id] = ++acc[game.id] || 1
    })
    return acc
  }, {})

  // console.log(enteredGames)
  return enteredGames
}

export const getNumberOfFullGames = (games, usersByGames) => {
  let counter = 0
  games.forEach(game => {
    if (
      parseInt(game.maxAttendance, 10) === parseInt(usersByGames[game.id], 10)
    ) {
      counter++
    }
  })

  console.log(
    `Games with maximum number of players: ${counter}/${
      games.length
    } (${toPercent(counter / games.length)}%)`
  )
}

export const getSignupsByStartTime = users => {
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

  // console.log(`Total number of signups by time: \n`, userSignupCountsByTime)
  return userSignupCountsByTime
}

export const getMaximumNumberOfPlayersByTime = games => {
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
  console.log(
    `Maximum number of seats by starting times: \n`,
    maxNumberOfPlayersByTime
  )
  */

  return maxNumberOfPlayersByTime
}

export const getDemandByTime = (
  signupsByTime,
  maximumNumberOfPlayersByTime
) => {
  for (const startTime in maximumNumberOfPlayersByTime) {
    console.log(
      `Demand for ${moment(startTime).format('DD.M.YYYY HH:mm')}: ${
        signupsByTime[startTime]
      }/${maximumNumberOfPlayersByTime[startTime]} (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    )
  }
}
