/* @flow */
import requestPromiseNative from 'request-promise-native'
import { logger } from 'utils/logger'
import { config } from 'config'

export const updateGames = async (): Promise<any> => {
  logger.info('Games: GET games from remote server')

  const options = {
    uri: config.dataUri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  }

  let programItems = null
  try {
    programItems = await requestPromiseNative(options)
  } catch (error) {
    logger.error(`Games: requestPromiseNative(): ${error}`)
    return Promise.reject(error)
  }

  const games = []

  // TODO: Filter games in designated locations, i.e. not "hall 5"
  if (programItems) {
    programItems.forEach(game => {
      if (game.category_title === 'Roolipeli') {
        games.push(game)
      }
    })
  }
  return games
}
