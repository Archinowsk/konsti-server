const { logger } = require('../../../utils/logger')

const getSignupWishes = players => {
  const signupWishes = []

  // Get signup wishes for all players
  players.forEach(player => {
    player.signed_games.forEach(signedGame => {
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

module.exports = getSignupWishes
