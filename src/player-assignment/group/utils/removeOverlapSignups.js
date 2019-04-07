import moment from 'moment'
import logger from 'utils/logger'

const removeOverlapSignups = (result, games, players) => {
  // Remove signups that overlap with assignment result

  const newSignupData = []

  if (!result.results) return
  /* $FlowFixMe */
  result.results.forEach(result => {
    const enteredGame = games.find(
      game => game.gameId === result.enteredGame.gameId
    )

    const signedPlayer = players.find(
      player => player.username === result.username
    )

    const newSignedGames = []

    if (signedPlayer && signedPlayer.signedGames) {
      /* $FlowFixMe */
      signedPlayer.signedGames.forEach(signedGame => {
        const signedGameDetails = games.find(
          game => game.gameId === signedGame.gameId
        )

        // If signed game takes place during the length of entered game, cancel it
        if (
          moment(signedGameDetails.startTime).isBetween(
            moment(enteredGame.startTime).add(1, 'minutes'),
            moment(enteredGame.endTime)
          )
        ) {
          // Remove this signup
          logger.debug(
            `Signed game "${signedGameDetails.title}" starts at ${moment(
              signedGameDetails.startTime
            ).format()}`
          )

          logger.debug(
            `Entered game "${enteredGame.title}" ends at ${moment(
              enteredGame.endTime
            ).format()}`
          )
          logger.debug(`=> Remove signup "${signedGameDetails.title}"`)
        } else {
          newSignedGames.push(signedGame)
        }
      })
    }

    newSignupData.push({
      username: signedPlayer.username,
      signedGames: newSignedGames,
    })
  })

  return newSignupData
}

export default removeOverlapSignups
