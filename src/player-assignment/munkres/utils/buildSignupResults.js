/* @flow */
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

type signedGame = { id: number, priority: number }

type signupResult = {
  username: string,
  enteredGame: { id: number },
  signedGames: Array<signedGame>,
}

const buildSignupResults = (
  results: Array<Array<number>>,
  selectedGames: Array<Game>,
  selectedPlayers: Array<User>
): Array<signupResult> => {
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
          enteredGame: { id: selectedGames[j].id },
          signedGames: selectedPlayers[selectedPlayer].signedGames,
        })
        break
      }
    }
  }
  return signupResults
}

export default buildSignupResults
