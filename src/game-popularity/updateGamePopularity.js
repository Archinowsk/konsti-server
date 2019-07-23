/* @flow */
import 'array-flat-polyfill'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { updateWithSignups } from 'game-popularity/utils/updateWithSignups'

export const updateGamePopularity = async () => {
  logger.info('Calculate game popularity')

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  let users = []
  try {
    users = await db.user.findUsers()
  } catch (error) {
    logger.error(`db.user.findUsers error: ${error}`)
  }

  let games = []
  try {
    games = await db.game.findGames()
  } catch (error) {
    logger.error(`db.user.findGames error: ${error}`)
  }

  await updateWithSignups(users, games)

  logger.info('Game popularity updated')
}
