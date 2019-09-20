// @flow
import { logger } from 'utils/logger'
import type { Game } from 'flow/game.flow'
import type { SignupWish } from 'flow/user.flow'

export const getSignedGames = (
  startingGames: $ReadOnlyArray<Game>,
  signupWishes: $ReadOnlyArray<SignupWish>
) => {
  logger.debug('Get selected games')
  const signedGames = []
  let minAttendance = 0
  let maxAttendance = 0

  // Get valid games from games that are starting and games that have wishes
  startingGames.forEach(startingGame => {
    for (let i = 0; i < signupWishes.length; i += 1) {
      if (startingGame.gameId === signupWishes[i].gameId) {
        signedGames.push(startingGame)
        minAttendance += startingGame.minAttendance
        maxAttendance += startingGame.maxAttendance
        break
      }
    }
  })

  logger.debug(
    `Found ${signedGames.length} games that have signup wishes and ${minAttendance}-${maxAttendance} available seats`
  )

  return signedGames
}
