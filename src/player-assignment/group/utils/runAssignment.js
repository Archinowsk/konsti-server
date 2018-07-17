/* @flow */
import getRandomInt from '/player-assignment/utils/getRandomInt'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

type UserArray = Array<User>
type SignedGame = { id: string, priority: number }
type SignupResult = {
  username: string,
  enteredGame: { id: string },
  signedGames: Array<SignedGame>,
}

const runAssignment = (
  playerGroups: Array<UserArray>,
  selectedGames: Array<Game>
): { score: number, signupResults: Array<SignupResult> } => {
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

export default runAssignment
