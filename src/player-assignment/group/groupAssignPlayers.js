/* @flow */
import { logger } from '../../utils/logger'
import getStartingGames from '../utils/getStartingGames'
import getSignupWishes from '../utils/getSignupWishes'
import getSelectedGames from '../utils/getSelectedGames'
import getSelectedPlayers from '../utils/getSelectedPlayers'

const groupAssignPlayers = (
  players: Array<Object>,
  games: Array<Object>,
  startingTime: Date
) => {
  const startingGames = getStartingGames(games, startingTime)
  const signupWishes = getSignupWishes(players)
  const selectedGames = getSelectedGames(startingGames, signupWishes)
  const selectedPlayers = getSelectedPlayers(players, startingGames)

  logger.info(`Selected games: ${JSON.stringify(selectedGames)}`)
  logger.info(`Selected players: ${JSON.stringify(selectedPlayers)}`)

  const signupResults = null

  return signupResults
}

export default groupAssignPlayers
