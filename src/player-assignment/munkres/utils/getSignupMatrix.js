/* @flow */
// const { logger } = require('../../../utils/logger')

const getSignupMatrix = (
  selectedGames: Array<Object>,
  selectedPlayers: Array<Object>
) => {
  // Create matrix for the sorting algorithm
  // Each available seat is possible result
  // Sort same game wishes to single array
  const signupMatrix: Array<any> = []
  let counter = 0

  // For each starting game...
  selectedGames.forEach(selectedGame => {
    const gameSignups: Array<number> = []

    // ... check if players have wishes that match with game id
    selectedPlayers.forEach(player => {
      let match = false
      for (let i = 0; i < player.signed_games.length; i += 1) {
        // Player has wish that matches starting game
        if (selectedGame.id === player.signed_games[i].id) {
          if (typeof player.signed_games[i].priority === 'undefined') {
            gameSignups.push(9)
          } else {
            gameSignups.push(player.signed_games[i].priority)
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
    for (let j = 0; j < selectedGame.max_attendance; j += 1) {
      // Copy array, don't add reference
      signupMatrix[counter] = gameSignups.slice()
      counter += 1
    }
  })

  return signupMatrix
}

module.exports = getSignupMatrix
