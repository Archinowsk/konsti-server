/* @flow */
import { logger } from '../../../utils/logger'

const getSignupWishes = (players: Array<Object>) => {
  const signupWishes = []

  // Get signup wishes for all players
  players.forEach(player => {
    player.signedGames.forEach(signedGame => {
      signupWishes.push({
        username: player.username,
        id: signedGame.id,
        priority: signedGame.priority,
      })
    })
  })

  logger.info(`Found ${signupWishes.length} signup wishes`)

  return signupWishes
}

export default getSignupWishes
