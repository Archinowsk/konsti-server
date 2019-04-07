import { toPercent } from '../statsUtil'

export const getUsersByGames = users => {
  const enteredGames = users.reduce((acc, user) => {
    user.enteredGames.forEach(game => {
      acc[game.gameId] = ++acc[game.gameId] || 1
    })
    return acc
  }, {})

  console.log(enteredGames)
}

export const getUsersWithoutGames = users => {
  let counter = 0
  const usersWithoutGames = []
  users.forEach(user => {
    if (user.enteredGames.length === 0 && user.signedGames.length !== 0) {
      usersWithoutGames.push(user)
      counter += 1
    }
  })

  console.log(
    `Players without any entered games: ${counter}/${users.length} (${toPercent(
      counter / users.length
    )}%)`
  )

  return usersWithoutGames
}

export const getUsersWithoutSignups = users => {
  let counter = 0
  const usersWithoutSignups = []
  users.forEach(user => {
    if (user.signedGames.length === 0) {
      usersWithoutSignups.push(user)
      counter += 1
    }
  })

  console.log(
    `Players without any signed games: ${counter}/${users.length} (${toPercent(
      counter / users.length
    )}%)`
  )

  return usersWithoutSignups
}

export const getUsersSignupCount = users => {
  const userSignupCounts = []
  users.forEach(user => {
    const signedGames = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1
      return acc
    }, {})
    userSignupCounts.push(signedGames)
  })

  const gameWishes = {}
  userSignupCounts.forEach(userSignups => {
    for (const signupTime in userSignups) {
      gameWishes[userSignups[signupTime]] =
        ++gameWishes[userSignups[signupTime]] || 1
    }
  })

  console.log(
    `Users signed for this many games when they didn't get signed:`,
    gameWishes
  )

  const signupCount = {}
  userSignupCounts.forEach(userSignups => {
    signupCount[Object.keys(userSignups).length] =
      ++signupCount[Object.keys(userSignups).length] || 1
  })

  console.log(
    `Users didn't get into any games after this many signup attemps:`,
    signupCount
  )
}

export const getUsersWithAllGames = users => {
  let counter = 0

  users.forEach(user => {
    const signedGamesByTime = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1
      return acc
    }, {})

    if (Object.keys(signedGamesByTime).length === user.enteredGames.length) {
      counter++
    }
  })

  console.log(
    `This many users got into a game each time they signed up: ${counter}/${
      users.length
    } (${toPercent(counter / users.length)}%)`
  )
}
