/* @flow */
import logger from 'utils/logger'
import type { Game } from 'flow/game.flow'
import type { User } from 'flow/user.flow'

const getSignupMatrix = (
  signedGames: $ReadOnlyArray<Game>,
  selectedPlayers: $ReadOnlyArray<User>
) => {
  logger.info('Generate signup matrix')
  // Create matrix for the sorting algorithm
  // Each available seat is possible result
  // Sort same game wishes to single array
  const signupMatrix: Array<Array<number>> = []
  let counter = 0

  // For each starting game...
  signedGames.forEach(signedGame => {
    const gameSignups: Array<number> = []

    // ... check if players have wishes that match with game id
    selectedPlayers.forEach(player => {
      let match = false
      for (let i = 0; i < player.signedGames.length; i += 1) {
        // Player has wish that matches starting game
        if (signedGame.gameId === player.signedGames[i].gameDetails.gameId) {
          if (typeof player.signedGames[i].priority === 'undefined') {
            gameSignups.push(9)
          } else {
            gameSignups.push(player.signedGames[i].priority)
          }
          match = true
          break
        }
      }
      // Add "empty" value if no match
      if (!match) {
        gameSignups.push(9)
      }
    })
    // Add one matrix row for each attendance seat
    for (let j = 0; j < signedGame.maxAttendance; j += 1) {
      // Copy array, don't add reference
      signupMatrix[counter] = gameSignups.slice()
      counter += 1
    }
  })

  return signupMatrix
}

export default getSignupMatrix
