/* @flow */
import logger from 'utils/logger'
import type { Game } from 'flow/game.flow'
import type { Result } from 'flow/result.flow'

const checkMinAttendance = (
  results: Array<Result>,
  signedGames: Array<Game>
) => {
  // Check that game minAttendance is fullfilled
  const gameIds = []

  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10)

    // Figure what games the row numbers are
    let attendanceRange = 0
    for (let j = 0; j < signedGames.length; j += 1) {
      attendanceRange += signedGames[j].maxAttendance
      // Found game
      if (selectedRow < attendanceRange) {
        gameIds.push(signedGames[j].gameId)
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
  signedGames.forEach(signedGame => {
    if (counts[signedGame.gameId] < signedGame.minAttendance) {
      gamesWithTooFewPlayers.push({
        game: signedGame,
        players: counts[signedGame.gameId],
      })
      logger.info(
        `Too few people for game "${signedGame.title}" (${
          counts[signedGame.gameId]
        }/${signedGame.minAttendance})`
      )
    }
  })

  return gamesWithTooFewPlayers
}

export default checkMinAttendance
