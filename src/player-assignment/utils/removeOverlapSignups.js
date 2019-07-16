/* @flow */
import moment from 'moment'
import { logger } from 'utils/logger'
import type { User } from 'flow/user.flow'
import type { Signup, Result } from 'flow/result.flow'

export const removeOverlapSignups = (
  results: $ReadOnlyArray<Result>,
  players: $ReadOnlyArray<User>
): $ReadOnlyArray<Signup> => {
  logger.debug('Clear overlapping signups')
  const signupData = []

  results.forEach(result => {
    const enteredGame = result.enteredGame.gameDetails

    if (!enteredGame) return new Error('Error finding entered game')

    const signedPlayer = players.find(
      player => player.username === result.username
    )

    if (!signedPlayer) return new Error('Error finding signed player')

    const newSignedGames = []

    if (signedPlayer && signedPlayer.signedGames) {
      signedPlayer.signedGames.forEach(signedGame => {
        // If signed game takes place during the length of entered game, cancel it
        if (
          moment(signedGame.gameDetails.startTime).isBetween(
            moment(enteredGame.startTime).add(1, 'minutes'),
            moment(enteredGame.endTime)
          )
        ) {
          // Remove this signup
          logger.debug(
            `Signed game "${signedGame.gameDetails.title}" starts at ${moment(
              signedGame.gameDetails.startTime
            ).format()}`
          )

          logger.debug(
            `Entered game "${enteredGame.title}" ends at ${moment(
              enteredGame.endTime
            ).format()}`
          )
          logger.debug(`=> Remove signup "${signedGame.gameDetails.title}"`)
        } else {
          newSignedGames.push(signedGame)
        }
      })
    }

    signupData.push({
      username: signedPlayer.username,
      signedGames: newSignedGames,
    })
  })

  return signupData
}
