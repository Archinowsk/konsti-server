/* @flow */
import logger from 'utils/logger'
import getRandomInt from 'player-assignment/utils/getRandomInt'
import shuffleArray from 'utils/shuffleArray'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Result } from 'flow/result.flow'

type UserArray = Array<User>

type AssignmentResult = {
  score: number,
  signupResults: Array<Result>,
  players: number,
  games: number,
}

const runAssignment = (
  playerGroups: Array<UserArray>,
  selectedGames: Array<Game>
): AssignmentResult => {
  const signupResults = []
  let matchingGroups = []
  let selectedGroups = []
  let score = 0
  let players = 0
  let games = 0

  // Shuffle games order
  const shuffledGames = shuffleArray(selectedGames)

  for (let selectedGame of shuffledGames) {
    for (let playerGroup of playerGroups) {
      // Get groups with specific game signup
      // Always use first player in group
      playerGroup[0].signedGames.forEach(signedGame => {
        if (signedGame.gameDetails.gameId === selectedGame.gameId) {
          matchingGroups.push(playerGroup)
        }
      })
    }

    // Number of matching players
    const playersCount = matchingGroups.reduce(
      (acc, matchingGroup) => acc + matchingGroup.length,
      0
    )

    logger.debug(
      `Found ${
        matchingGroups.length
      } groups with ${playersCount} players for game "${selectedGame.title}", ${
        selectedGame.minAttendance
      }-${selectedGame.maxAttendance} players required`
    )

    // Not enough interested players, game will not happen
    if (playersCount < selectedGame.minAttendance) {
      logger.debug(
        `Not enough players for game "${
          selectedGame.title
        }" (signed: ${playersCount}, required: ${selectedGame.minAttendance}-${
          selectedGame.maxAttendance
        })`
      )
      break
    }

    // Maximum number of players is either game's limit or number of interested players
    const maximumPlayers = Math.min(selectedGame.maxAttendance, playersCount)

    let numberOfPlayers = 0
    let counter = 0
    const counterLimit = 10

    while (numberOfPlayers < maximumPlayers) {
      // Randomize group to enter the game
      let groupNumber = getRandomInt(0, matchingGroups.length - 1)
      const selectedGroup = matchingGroups[groupNumber]

      if (selectedGroup.length === 1) {
        logger.debug(`Selected player: ${selectedGroup[0].username} `)
      } else {
        logger.debug(
          `Selected group ${selectedGroup[0].playerGroup} with ${
            selectedGroup.length
          } players`
        )
      }

      // Enough seats remaining for the game
      if (numberOfPlayers + selectedGroup.length <= maximumPlayers) {
        numberOfPlayers += selectedGroup.length

        selectedGroups.push(selectedGroup)

        // Remove selected group from MATCHING groups array
        matchingGroups = matchingGroups.filter(
          remainingGroup =>
            remainingGroup[0].username !== selectedGroup[0].username
        )

        const seatsRemaining = maximumPlayers - numberOfPlayers
        logger.debug(`Seats remaining: ${seatsRemaining}`)
      }
      // Not enought seats remaining for the game
      else {
        counter += 1
        logger.debug(`No match, increase counter: ${counter}/${counterLimit}`)
        if (counter >= counterLimit) {
          logger.debug(`Limit reached, stop loop`)
          break
        }
      }
    }

    // Check if game has enough signups
    if (numberOfPlayers < selectedGame.minAttendance) {
      // Not enought signups, game will not happen
      logger.debug(
        `Not enough signups for game "${
          selectedGame.title
        }" (signed: ${playersCount}, assigned: ${numberOfPlayers}, required: ${
          selectedGame.minAttendance
        }-${selectedGame.maxAttendance})`
      )
    } else {
      // Enough signups, game will happen
      // Store results for selected groups
      for (let selectedGroup of selectedGroups) {
        for (let groupMember of selectedGroup) {
          let signedGame = groupMember.signedGames.find(
            game => game.gameDetails.gameId === selectedGame.gameId
          )

          // Increase score based on priority of the entered game
          if (signedGame && signedGame.priority === 1) {
            score += 3
          } else if (signedGame && signedGame.priority === 2) {
            score += 2
          } else if (signedGame && signedGame.priority === 3) {
            score += 1
          }

          players += 1

          signupResults.push({
            username: groupMember.username,
            enteredGame: selectedGame,
            signedGames: groupMember.signedGames,
          })
        }

        // TODO: Figure correct group penalty
        // Adjust the score based on group size
        // Group of 1 = 0     => prio 1 = 3                 | prio 2 = 2                  | prio 3 = 1
        // Group of 2-3 = 1   => prio 1 = 6-9 - 1 = 5-8     | prio 2 = 4-6 - 1 = 3-5      | prio 3 = 2-3 - 1 = 1-2
        // Group of 4-5 = 2   => prio 1 = 12-15 - 2 = 10-13 | prio 2 = 8-10 - 2 = 6-8     | prio 3 = 4-5 - 2 = 2-3
        // Group of 6-7 = 3   => prio 1 = 18-21 - 3 = 15-18 | prio 2 = 12-14 - 3 = 9 - 11 | prio 3 = 6-7 - 3 = 3-4
        // score -= Math.round(selectedGroup.length / 2)
      }

      // Remove selected groups from ALL groups array
      playerGroups = playerGroups.filter(remainingGroup => {
        for (let selectedGroup of selectedGroups) {
          if (remainingGroup[0].username === selectedGroup[0].username) {
            return undefined
          }
        }
        return remainingGroup
      })

      games += 1
    }

    logger.debug(`${playerGroups.length} player groups remaining`)

    // Clear selections
    matchingGroups = []
    selectedGroups = []

    logger.debug(`**************`)
  }

  return {
    score,
    signupResults,
    players,
    games,
  }
}

export default runAssignment
