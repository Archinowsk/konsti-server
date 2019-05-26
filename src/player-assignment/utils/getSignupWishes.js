/* @flow */
import logger from 'utils/logger'
import type { User } from 'flow/user.flow'

const getSignupWishes = (players: Array<User>) => {
  logger.info('Get signup wishes')
  const signupWishes = []

  // Get signup wishes for all players
  players.forEach(player => {
    player.signedGames.forEach(signedGame => {
      signupWishes.push({
        username: player.username,
        gameId: signedGame.gameDetails.gameId,
        priority: signedGame.priority,
      })
    })
  })

  logger.info(`Found ${signupWishes.length} signup wishes`)

  return signupWishes
}

export default getSignupWishes
