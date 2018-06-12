// const { logger } = require('../../../utils/logger')

const getRemovedGame = gamesWithTooFewPlayers => {
  // Get games with least players
  const sortedGamesWithTooFewPlayers = gamesWithTooFewPlayers.sort((a, b) => {
    const keyA = a.players
    const keyB = b.players
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })

  // logger.info('sortedGamesWithTooFewPlayers');
  // logger.info(sortedGamesWithTooFewPlayers);

  // Find games that are tied to the lowest player count
  const tiedToLowest = []
  for (let i = 0; i < sortedGamesWithTooFewPlayers.length; i += 1) {
    if (
      sortedGamesWithTooFewPlayers[i].players ===
      sortedGamesWithTooFewPlayers[0].players
    )
      tiedToLowest.push(sortedGamesWithTooFewPlayers[i])
    // logger.info(sortedGamesWithTooFewPlayers[i].players);
  }

  // logger.info('tiedToLowest');

  /*
  for (let i = 0; i < tiedToLowest.length; i += 1) {
    logger.info(tiedToLowest[i].players);
  }
  */

  const randomIndex = Math.floor(Math.random() * tiedToLowest.length)
  const removedGame = tiedToLowest[randomIndex].game

  // logger.info(`Removing game ${removedGame.title}`);

  return removedGame
}

module.exports = getRemovedGame
