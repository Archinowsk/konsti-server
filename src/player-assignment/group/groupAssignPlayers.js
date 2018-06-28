/* @flow */
import { logger } from '/utils/logger'
import getStartingGames from '/player-assignment/utils/getStartingGames'
import getSignupWishes from '/player-assignment/utils/getSignupWishes'
import getSelectedGames from '/player-assignment/utils/getSelectedGames'
import getSelectedPlayers from '/player-assignment/utils/getSelectedPlayers'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const groupAssignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date
) => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  let selectedPlayers = getSelectedPlayers(players, startingGames)

  const signupResults = []

  logger.info(`Selected games: ${selectedGames.length}`)
  logger.info(`Selected players: ${selectedPlayers.length}`)

  /*
  // Group all unique group numbers
  const groupedUsers = selectedPlayers.reduce((acc, player) => {
    acc[player['playerGroup']] = acc[player['playerGroup']] || []
    acc[player['playerGroup']].push(player)
    return acc
  }, {})

  const playersArray = [[]]
  for (const [key: String, value: Array<User>] of Object.entries(
    groupedUsers
  )) {
    console.log(typeof value)
    console.log(Array.isArray(value))

    if (Array.isArray(value)) {
      if (key === '0') {
        players.push(value)
      } else {
        players.push(value)
      }
    }
  }

  console.log(playersArray)
  */

  let matchingPlayers = []

  for (let i = 0; i < selectedGames.length; i++) {
    for (let j = 0; j < selectedPlayers.length; j++) {
      for (let k = 0; k < selectedPlayers[j].signedGames.length; k++) {
        // Get players with specific game signup
        if (selectedPlayers[j].signedGames[k].id === selectedGames[i].id) {
          matchingPlayers.push(selectedPlayers[j])
        }
      }
    }

    logger.info(
      `Found ${matchingPlayers.length} players for game "${
        selectedGames[i].title
      }", ${selectedGames[i].minAttendance}-${
        selectedGames[i].maxAttendance
      } required`
    )

    const maximumPlayers = Math.min(
      selectedGames[i].maxAttendance,
      matchingPlayers.length
    )

    for (let h = 0; h < maximumPlayers; h++) {
      // Randomize player to enter the game
      let playerNumber = getRandomInt(0, matchingPlayers.length - 1)
      logger.info(`Selected player: ${matchingPlayers[playerNumber].username}`)

      // Store results for selected player
      signupResults.push({
        username: matchingPlayers[playerNumber].username,
        enteredGame: selectedGames[i].id,
        signedGames: matchingPlayers[playerNumber].signedGames,
      })

      // Remove selected player from players array
      selectedPlayers = selectedPlayers.filter(
        remainingPlayer =>
          remainingPlayer.username !== matchingPlayers[playerNumber].username
      )

      // Remove matched player from matching players array
      matchingPlayers.splice(playerNumber, 1)

      // logger.info(`Players remaining: ${matchingPlayers.length}`)
      // logger.info(`Players remaining: ${selectedPlayers.length}`)
    }

    matchingPlayers = []
  }

  return signupResults
}

export default groupAssignPlayers
