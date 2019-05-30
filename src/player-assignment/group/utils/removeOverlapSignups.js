/* @flow */
import moment from 'moment'
import logger from 'utils/logger'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Result } from 'flow/result.flow'

type ResulstWithMessage = {
  results: Array<Result>,
  message: string,
}

const removeOverlapSignups = (
  result: ResulstWithMessage,
  games: Array<Game>,
  players: Array<User>
) => {
  // Remove signups that overlap with assignment result

  const newSignupData = []

  if (!result.results) return
  result.results.forEach(result => {
    const enteredGame = games.find(
      game => game.gameId === result.enteredGame.gameId
    )

    if (!enteredGame) return new Error('Error finding entered game')

    const signedPlayer = players.find(
      player => player.username === result.username
    )

    if (!signedPlayer) return new Error('Error finding signed player')

    const newSignedGames = []

    if (signedPlayer && signedPlayer.signedGames) {
      signedPlayer.signedGames.forEach(signedGame => {
        const signedGameDetails = games.find(
          game => game.gameId === signedGame.gameDetails.gameId
        )

        if (!signedGameDetails) return new Error('Error finding signed game')

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
