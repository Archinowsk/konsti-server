/* @flow */
import moment from 'moment'
import logger from 'utils/logger'
import type { Game } from 'flow/game.flow'

const getStartingGames = (games: Array<Game>, startingTime: Date) => {
  logger.info('Get starting games')
  const startingGames = []
  const selectedStartingTime = moment(startingTime).format()

  // Get games that start at defined time
  games.forEach(game => {
    const gameStartingTime = moment(game.startTime).format()
    if (gameStartingTime === selectedStartingTime) {
      startingGames.push(game)
    }
  })

  logger.info(`Found ${startingGames.length} games for this starting time`)

  return startingGames
}

export default getStartingGames
