/* @flow */
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Result } from 'flow/result.flow'

const buildSignupResults = (
  results: Array<Array<number>>,
  selectedGames: Array<Game>,
  selectedPlayers: Array<User>
): Array<Result> => {
  const signupResults = []

  // Build signup results
  for (let i = 0; i < results.length; i += 1) {
    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10)

    // Player id
    const selectedPlayer = parseInt(results[i][1], 10)

    let attendanceRange = 0

    // Figure what games the row numbers are
    for (let j = 0; j < selectedGames.length; j += 1) {
      attendanceRange += selectedGames[j].maxAttendance

      // Found game
      if (selectedRow < attendanceRange) {
        signupResults.push({
          username: selectedPlayers[selectedPlayer].username,
          enteredGame: selectedGames[j],
          signedGames: selectedPlayers[selectedPlayer].signedGames,
        })
        break
      }
    }
  }
  return signupResults
}

export default buildSignupResults
