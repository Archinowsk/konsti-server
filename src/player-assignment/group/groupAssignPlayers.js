/* @flow */
import logger from '/utils/logger'
import getStartingGames from '/player-assignment/utils/getStartingGames'
import getSignupWishes from '/player-assignment/utils/getSignupWishes'
import getSelectedGames from '/player-assignment/utils/getSelectedGames'
import getSelectedPlayers from '/player-assignment/utils/getSelectedPlayers'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

type UserArray = Array<User>

type signedGame = { id: number, priority: number }

type signupResult = {
  username: string,
  enteredGame: { id: number },
  signedGames: Array<signedGame>,
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getPlayerGroups = (players: Array<User>): Array<UserArray> => {
  // Group all unique group numbers
  const groupedUsers = players.reduce((acc, player) => {
    acc[player['playerGroup']] = acc[player['playerGroup']] || []
    acc[player['playerGroup']].push(player)
    return acc
  }, {})

  const playersArray = []
  for (const [key, value] of Object.entries(groupedUsers)) {
    if (Array.isArray(value)) {
      if (key === '0') {
        // Loop array and add players individually
        for (let i = 0; i < value.length; i++) {
          playersArray.push([value[i]])
        }
      } else {
        playersArray.push(value)
      }
    }
  }

  // $FlowFixMe
  return playersArray
}

const runAssignment = (
  playerGroups: Array<UserArray>,
  selectedGames: Array<Game>
): { score: number, signupResults: Array<signupResult> } => {
  const signupResults = []
  let matchingGroups = []
  let score = 0

  selectedGames.forEach(selectedGame => {
    playerGroups.forEach(playerGroup => {
      // Get players with specific game signup
      // Always use first player in group
      playerGroup[0].signedGames.forEach(signedGame => {
        if (signedGame.id === selectedGame.id) {
          matchingGroups.push(playerGroup)
        }
      })
    })

    const maxPlayers = matchingGroups.reduce(
      (acc, matchingGroup) => acc + matchingGroup.length,
      0
    )

    /*
    logger.info(
      `Found ${
        matchingGroups.length
      } groups with ${maxPlayers} players for game "${selectedGame.title}", ${
        selectedGame.minAttendance
      }-${selectedGame.maxAttendance} players required`
    )
    */

    const maximumPlayers = Math.min(selectedGame.maxAttendance, maxPlayers)

    let numberOfPlayers = 0
    let counter = 0
    const counterLimit = 10
    while (numberOfPlayers < maximumPlayers) {
      // Randomize player to enter the game
      let groupNumber = getRandomInt(0, matchingGroups.length - 1)
      const selectedGroup = matchingGroups[groupNumber]

      /*
      if (selectedGroup.length === 1) {
        logger.info(`Selected player: ${selectedGroup[0].username} `)
      } else {
        logger.info(
          `Selected group ${selectedGroup[0].playerGroup} with ${
            selectedGroup.length
          } players`
        )
      }
      */

      if (numberOfPlayers + selectedGroup.length <= maximumPlayers) {
        numberOfPlayers += selectedGroup.length

        // logger.info(`Seats remaining: ${maximumPlayers - numberOfPlayers}`)

        // Store results for selected groups members
        selectedGroup.forEach(groupMember => {
          score += 1
          signupResults.push({
            username: groupMember.username,
            enteredGame: { id: selectedGame.id },
            signedGames: groupMember.signedGames,
          })
        })

        // Remove selected groups from groups array
        playerGroups = playerGroups.filter(
          remainingGroup =>
            remainingGroup[0].username !== selectedGroup[0].username
        )

        // Remove matched player from matching players array
        matchingGroups.splice(groupNumber, 1)
      } else {
        counter += 1
        // logger.info(`No match, increase counter: ${counter}/${counterLimit}`)
        if (counter >= counterLimit) {
          // logger.info(`Limit reached, stop loop`)
          break
        }
      }
    }

    matchingGroups = []
  })

  return {
    score,
    signupResults,
  }
}

const assignGroups = (
  selectedPlayers: Array<User>,
  selectedGames: Array<Game>
) => {
  const playerGroups = getPlayerGroups(selectedPlayers)
  const rounds = 10000
  let bestScore = 0
  let result = null
  let bestResult = null

  for (let i = 0; i < rounds; i++) {
    result = runAssignment(playerGroups, selectedGames)
    if (result.score > bestScore) {
      bestScore = result.score
      bestResult = result.signupResults
      logger.info(`New best score: ${bestScore}`)
    }
  }

  logger.info(
    `Final score: ${bestScore}/${selectedPlayers.length} (${(bestScore /
      selectedPlayers.length) *
      100}%)`
  )

  return bestResult
}

const groupAssignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date
) => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)

  logger.info(`Selected games: ${selectedGames.length}`)
  logger.info(`Selected players: ${selectedPlayers.length}`)

  const result = assignGroups(selectedPlayers, selectedGames)

  return result
}

export default groupAssignPlayers
