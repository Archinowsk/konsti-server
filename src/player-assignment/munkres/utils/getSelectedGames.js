const { logger } = require('../../../utils/logger')

const getSelectedGames = (startingGames, signupWishes) => {
  const selectedGames = []
  let minAttendance = 0
  let maxAttendance = 0

  // Get valid games from games that are starting and games that have wishes
  startingGames.forEach(startingGame => {
    for (let i = 0; i < signupWishes.length; i += 1) {
      if (startingGame.id === signupWishes[i].id) {
        selectedGames.push(startingGame)
        minAttendance += startingGame.min_attendance
        maxAttendance += startingGame.max_attendance
        break
      }
    }
  })

  logger.info(
    `Found ${
      selectedGames.length
    } games that have signup wishes and ${minAttendance}-${maxAttendance} available seats`
  )

  return selectedGames
}

module.exports = getSelectedGames
