/* @flow */
import logger from 'utils/logger'

const checkMinAttendance = (
  results: Array<Object>,
  selectedGames: Array<Object>
) => {
  // Check that game minAttendance is fullfilled
  const gameIds = []

  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10)

    // Figure what games the row numbers are
    let attendanceRange = 0
    for (let j = 0; j < selectedGames.length; j += 1) {
      attendanceRange += selectedGames[j].maxAttendance
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
    if (counts[selectedGame.id] < selectedGame.minAttendance) {
      gamesWithTooFewPlayers.push({
        game: selectedGame,
        players: counts[selectedGame.id],
      })
      logger.info(
        `Too few people for game "${selectedGame.title}" (${
          counts[selectedGame.id]
        }/${selectedGame.minAttendance})`
      )
    }
  })

  return gamesWithTooFewPlayers
}

export default checkMinAttendance
