/* @flow */
import moment from 'moment'
import { logger } from '~/utils/logger'

const getStartingGames = (games: Array<Object>, startingTime: Date) => {
  logger.info('Get starting games')
  const startingGames = []
  const date = moment.utc(startingTime).format()

  // Get games that start at defined time
  games.forEach(game => {
    const utcTime = moment.utc(game.date).format()
    if (utcTime === date) {
      startingGames.push(game)
    }
  })

  logger.info(`Found ${startingGames.length} games for this starting time`)

  return startingGames
}

export default getStartingGames
