/* @flow */
const buildSignupResults = (
  results: Array<Object>,
  selectedGames: Array<Object>,
  selectedPlayers: Array<Object>
) => {
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
      let matchingGame
      attendanceRange += selectedGames[j].maxAttendance

      // Found game
      if (selectedRow < attendanceRange) {
        matchingGame = selectedGames[j]

        signupResults.push({
          username: selectedPlayers[selectedPlayer].username,
          enteredGame: { id: matchingGame.id },
          signedGames: selectedPlayers[selectedPlayer].signedGames,
        })
        break
      }
    }
  }
  return signupResults
}

export default buildSignupResults
