/* @flow */
import request from 'request-promise-native'
import { logger } from 'utils/logger'
import { config } from 'config'
import type { KompassiGame } from 'flow/game.flow'

export const updateGames = async (): Promise<$ReadOnlyArray<KompassiGame>> => {
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
    programItems = await request(options)
  } catch (error) {
    logger.error(`Games request error: ${error}`)
    return Promise.reject(error)
  }

  if (!programItems) {
    return []
  }

  return programItems.filter(programItem => {
    if (programItem.category_title === 'Roolipeli / Pen & Paper RPG') {
      return programItem
    }
  })
}
