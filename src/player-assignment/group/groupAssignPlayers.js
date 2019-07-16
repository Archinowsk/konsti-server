/* @flow */
import { logger } from 'utils/logger'
import { getStartingGames } from 'player-assignment/utils/getStartingGames'
import { getSignupWishes } from 'player-assignment/utils/getSignupWishes'
import { getSignedGames } from 'player-assignment/utils/getSignedGames'
import { getSelectedPlayers } from 'player-assignment/utils/getSelectedPlayers'
import { assignGroups } from 'player-assignment/group/utils/assignGroup'
import { getPlayerGroups } from 'player-assignment/utils/getPlayerGroups'
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups'
import { getGroupMembers } from 'player-assignment/utils/getGroupMembers'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { AssignResult } from 'flow/result.flow'

export const groupAssignPlayers = (
  players: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>,
  startingTime: string
): AssignResult => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const signedGames = getSignedGames(startingGames, signupWishes)

  // Selected players are group leaders since group members don't have signups at this point
  const groupLeaders = getSelectedPlayers(players, startingGames)
  const groupMembers = getGroupMembers(groupLeaders, players)
  const allPlayers = groupLeaders.concat(groupMembers)
  // Single user is size 1 group
  const playerGroups = getPlayerGroups(allPlayers)

  let numberOfIndividuals = 0
  let numberOfGroups = 0
  for (const playerGroup of playerGroups) {
    if (playerGroup.length > 1) {
      numberOfGroups += 1
    } else {
      numberOfIndividuals += 1
    }
  }

  logger.info(`Signed games: ${signedGames.length}`)
  logger.info(
    `Selected players: ${allPlayers.length} (${numberOfIndividuals} individual, ${numberOfGroups} groups)`
  )

  const result = assignGroups(allPlayers, signedGames, playerGroups)
  const newSignupData = removeOverlapSignups(result.results, players)

  return Object.assign({ ...result, newSignupData })
}
