/* @flow */
// import { logger } from '../../../utils/logger'

const buildSignupResults = (
  results: Array<Object>,
  selectedGames: Array<Object>,
  selectedPlayers: Array<Object>
) => {
  const signupResults = []

  // Build signup results
  for (let i = 0; i < results.length; i += 1) {
    // const matrixValue = signupMatrix[results[i][0]][results[i][1]];
    // logger.info(`matrix value: ${matrixValue}`);

    // Row determines the game
    const selectedRow = parseInt(results[i][0], 10)
    // logger.info(`selected row: ${selectedRow}`);

    // Player id
    const selectedPlayer = parseInt(results[i][1], 10)
    // logger.info(`selected player: ${selectedPlayer}`);

    let attendanceRange = 0

    // Figure what games the row numbers are
    for (let j = 0; j < selectedGames.length; j += 1) {
      let matchingGame
      attendanceRange += selectedGames[j].max_attendance

      // logger.info(`attendanceRange: ${attendanceRange}`);

      // Found game
      if (selectedRow < attendanceRange) {
        matchingGame = selectedGames[j]

        signupResults.push({
          username: selectedPlayers[selectedPlayer].username,
          enteredGame: { id: matchingGame.id },
          signedGames: selectedPlayers[selectedPlayer].signed_games,
        })
        break
      }
    }
  }
  return signupResults
}

export default buildSignupResults
