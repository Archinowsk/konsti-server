/* @flow */
const { logger } = require('../../../utils/logger')

const checkMinAttendance = (
  results: Array<Object>,
  selectedGames: Array<Object>
) => {
  // Check that game min_attendance is fullfilled
  const gameIds = []

  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10)
    // logger.info(`selected row: ${selectedRow}`);

    // Figure what games the row numbers are
    let attendanceRange = 0
    for (let j = 0; j < selectedGames.length; j += 1) {
      attendanceRange += selectedGames[j].max_attendance
      // Found game
      if (selectedRow < attendanceRange) {
        gameIds.push(selectedGames[j].id)
        break
      }
    }
  }

  const counts = {}
  gameIds.forEach(x => {
    counts[x] = (counts[x] || 0) + 1
  })

  // Find games with too few players
  const gamesWithTooFewPlayers = []
  selectedGames.forEach(selectedGame => {
    if (counts[selectedGame.id] < selectedGame.min_attendance) {
      gamesWithTooFewPlayers.push({
        game: selectedGame,
        players: counts[selectedGame.id],
      })
      logger.info(
        `Too few people for game ${selectedGame.title} (${
          counts[selectedGame.id]
        }/${selectedGame.min_attendance})`
      )
    }
  })

  return gamesWithTooFewPlayers
}

module.exports = checkMinAttendance
