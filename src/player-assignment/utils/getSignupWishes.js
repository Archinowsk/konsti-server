/* @flow */
import { logger } from 'utils/logger'
import type { User } from 'flow/user.flow'

export const getSignupWishes = (players: $ReadOnlyArray<User>) => {
  logger.debug('Get signup wishes')
  const signupWishes = []

  // Get signup wishes for all players
  players.forEach(player => {
    if (player.signedGames.length !== 0) {
      player.signedGames.forEach(signedGame => {
        signupWishes.push({
          username: player.username,
          gameId: signedGame.gameDetails.gameId,
          priority: signedGame.priority,
        })
      })
    }
  })

  logger.info(`Found ${signupWishes.length} signup wishes`)

  return signupWishes
}
