/* @flow */
import logger from 'utils/logger'
import type { Game } from 'flow/game.flow'

type SignupWish = {
  username: string,
  gameId: string,
  priority: number,
}

const getSignedGames = (
  startingGames: Array<Game>,
  signupWishes: Array<SignupWish>
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

  logger.info(
    `Found ${
      signedGames.length
    } games that have signup wishes and ${minAttendance}-${maxAttendance} available seats`
  )

  return signedGames
}

export default getSignedGames
