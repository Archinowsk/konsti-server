/* @flow */
import logger from 'utils/logger'
import getStartingGames from 'player-assignment/utils/getStartingGames'
import getSignupWishes from 'player-assignment/utils/getSignupWishes'
import getSignedGames from 'player-assignment/utils/getSignedGames'
import getSelectedPlayers from 'player-assignment/utils/getSelectedPlayers'
import assignGroups from 'player-assignment/group/utils/assignGroup'
import getPlayerGroups from 'player-assignment/group/utils/getPlayerGroups'
import removeOverlapSignups from 'player-assignment/group/utils/removeOverlapSignups'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { AssignResult } from 'flow/result.flow'

const groupAssignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date
): AssignResult => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const signedGames = getSignedGames(startingGames, signupWishes)

  // Individual user is a group of one
  const selectedGroupLeaders = getSelectedPlayers(players, startingGames)
  const selectedPlayers = selectedGroupLeaders.slice()

  for (let selectedGroupLeader of selectedGroupLeaders) {
    // Group leader has multiple users in group
    if (selectedGroupLeader.playerGroup !== '0') {
      for (let player of players) {
        // Player is in the group
        if (
          player.playerGroup === selectedGroupLeader.playerGroup &&
          player.username !== selectedGroupLeader.username
        ) {
          player.signedGames = selectedGroupLeader.signedGames
          selectedPlayers.push(player)
        }
      }
    }
  }

  // Group individual users to groups
  // Single user is size 1 group
  const selectedPlayerGroups = getPlayerGroups(selectedPlayers)

  let numberOfIndividuals = 0
  let numberOfGroups = 0
  for (let selectedPlayerGroup of selectedPlayerGroups) {
    if (selectedPlayerGroup.length > 1) {
      numberOfGroups += 1
    } else {
      numberOfIndividuals += 1
    }
  }

  logger.info(`Signed games: ${signedGames.length}`)
  logger.info(
    `Selected players: ${
      selectedPlayers.length
    } (${numberOfIndividuals} individual, ${numberOfGroups} groups)`
  )

  const result = assignGroups(
    selectedPlayers,
    signedGames,
    selectedPlayerGroups
  )

  const newSignupData = removeOverlapSignups(result, games, players)

  return Object.assign({ ...result, newSignupData })
}

export default groupAssignPlayers
