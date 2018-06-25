/* @flow */
import { logger } from '../../utils/logger'
import getStartingGames from '../utils/getStartingGames'
import getSignupWishes from '../utils/getSignupWishes'
import getSelectedGames from '../utils/getSelectedGames'
import getSelectedPlayers from '../utils/getSelectedPlayers'
import type { User } from '../../types/user.types'
import type { Game } from '../../types/game.types'

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

  const signupResults = null

  /*
  for (let i = 0; i < selectedGames.length; i++) {
    for (let j = 0; j < selectedPlayers.length; j++) {
      for (let k = 0; k < selectedPlayers[j].signedGames.length; k++) {}
    }
  }
  */

  return signupResults
}

export default groupAssignPlayers
