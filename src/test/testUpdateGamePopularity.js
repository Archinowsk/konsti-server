/* @flow */
import 'array-flat-polyfill'
import { logger } from 'utils/logger'
import { updateGamePopularity } from 'game-popularity/updateGamePopularity'
import { db } from 'db/mongodb'

const testUpdateGamePopularity = async () => {
  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  try {
    await updateGamePopularity()
  } catch (error) {
    logger.error(`updateGamePopularity error: ${error}`)
  }

  process.exit()
}

testUpdateGamePopularity()
