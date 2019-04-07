import moment from 'moment'

const removeOverlapSignups = (result, games, players) => {
  // Remove signups that overlap with assignment result

  const newSignupData = []

  if (!result.results) return
  /* $FlowFixMe */
  result.results.forEach(result => {
    const enteredGame = games.filter(
      game => game.gameId === result.enteredGame.gameId
    )

    const signedPlayer = players.filter(
      player => player.username === result.username
    )

    // console.log('before', signedPlayer[0].signedGames)

    const newSignedGames = []

    if (signedPlayer[0] && signedPlayer[0].signedGames) {
      /* $FlowFixMe */
      signedPlayer[0].signedGames.forEach(signedGame => {
        const signedGameDetails = games.filter(
          game => game.gameId === signedGame.gameId
        )

        // If signed game takes place during the length of entered game, cancel it
        if (
          moment(signedGameDetails[0].startTime).isBetween(
            moment(enteredGame[0].startTime).add(1, 'minutes'),
            moment(enteredGame[0].endTime)
          )
        ) {
          // Remove this signup
          /*
        console.log(
          `Signed game "${signedGameDetails[0].title}" starts at ${moment(
            signedGameDetails[0].startTime
          ).format()}`
        )

        console.log(
          `Entered game "${enteredGame[0].title}" ends at ${moment(
            enteredGame[0].endTime
          ).format()}`
        )
        */
        } else {
          newSignedGames.push(signedGame)
        }
      })
    }

    // console.log('after', signedPlayer[0].signedGames)

    newSignupData.push({
      username: signedPlayer[0].username,
      signedGames: newSignedGames,
    })
  })

  return newSignupData
}

export default removeOverlapSignups
