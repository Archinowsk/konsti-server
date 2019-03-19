import { toPercent } from '../statsUtil'

export const getSignupsByTime = (results, games) => {
  const signupsByTime = results.reduce((acc, result) => {
    acc[result.startTime] = result.result.length
    return acc
  }, {})

  /*
  console.log(
    `Number of people entering to games by starting times: \n`,
    signupsByTime
  )
  */

  return signupsByTime
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
  console.log('Sanity check: values over 100% are anomalies')
  for (const startTime in maximumNumberOfPlayersByTime) {
    console.log(
      `Signed people for ${startTime}: ${signupsByTime[startTime]}/${
        maximumNumberOfPlayersByTime[startTime]
      } (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    )
  }
}
