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
