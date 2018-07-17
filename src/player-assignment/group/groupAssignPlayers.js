/* @flow */
import logger from '/utils/logger'
import getStartingGames from '/player-assignment/utils/getStartingGames'
import getSignupWishes from '/player-assignment/utils/getSignupWishes'
import getSelectedGames from '/player-assignment/utils/getSelectedGames'
import getSelectedPlayers from '/player-assignment/utils/getSelectedPlayers'
import assignGroups from '/player-assignment/group/utils/assignGroup'
import getPlayerGroups from '/player-assignment/group/utils/getPlayerGroups'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

const groupAssignPlayers = (
  players: Array<User>,
  games: Array<Game>,
  startingTime: Date
) => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)

  // Group individual users to groups
  // Single user is size 1 group
  const playerGroups = getPlayerGroups(selectedPlayers)

  logger.info(`Selected games: ${selectedGames.length}`)
  logger.info(
    `Selected players: ${selectedPlayers.length} in ${
      playerGroups.length
    } groups`
  )

  const result = assignGroups(selectedPlayers, selectedGames, playerGroups)

  return result
}

export default groupAssignPlayers
