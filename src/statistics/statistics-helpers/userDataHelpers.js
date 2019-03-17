const toPercent = num => {
  return Math.round(num * 100)
}

export const getUsersByGames = userData => {
  const enteredGames = userData.reduce((acc, user) => {
    user.enteredGames.forEach(game => {
      acc[game.id] = ++acc[game.id] || 1
    })
    return acc
  }, {})

  console.log(enteredGames)
}

export const getUsersWithoutGames = userData => {
  let counter = 0
  const usersWithoutGames = []
  userData.forEach(user => {
    if (user.enteredGames.length === 0 && user.signedGames.length !== 0) {
      usersWithoutGames.push(user)
      counter += 1
    }
  })

  console.log(
    `Players without any entered games: ${counter}/${
      userData.length
    } (${toPercent(counter / userData.length)}%)`
  )

  return usersWithoutGames
}

export const getUsersWithoutSignups = userData => {
  let counter = 0
  const usersWithoutSignups = []
  userData.forEach(user => {
    if (user.signedGames.length === 0) {
      usersWithoutSignups.push(user)
      counter += 1
    }
  })

  console.log(
    `Players without any signed games: ${counter}/${
      userData.length
    } (${toPercent(counter / userData.length)}%)`
  )

  return usersWithoutSignups
}

export const getUsersSignupCount = userData => {
  const userSignupCounts = []
  userData.forEach(user => {
    const signedGames = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1
      return acc
    }, {})
    userSignupCounts.push(signedGames)
  })

  const counts = { '1': 0, '2': 0, '3': 0 }
  userSignupCounts.forEach(userSignups => {
    for (const key in userSignups) {
      counts[userSignups[key]] += 1
    }
  })

  console.log(`Number of signups with only one game wish: ${counts['1']}`)
  console.log(`Number of signups with two one game wishes: ${counts['2']}`)
  console.log(`Number of signups with three game wishes: ${counts['3']}`)
}
