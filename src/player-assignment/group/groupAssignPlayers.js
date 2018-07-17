/* @flow */
import logger from '/utils/logger'
import getStartingGames from '/player-assignment/utils/getStartingGames'
import getSignupWishes from '/player-assignment/utils/getSignupWishes'
import getSelectedGames from '/player-assignment/utils/getSelectedGames'
import getSelectedPlayers from '/player-assignment/utils/getSelectedPlayers'
import assignGroups from '/player-assignment/group/utils/assignGroup'
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

  logger.info(`Selected games: ${selectedGames.length}`)
  logger.info(`Selected players: ${selectedPlayers.length}`)

  const result = assignGroups(selectedPlayers, selectedGames)

  return result
}

export default groupAssignPlayers
