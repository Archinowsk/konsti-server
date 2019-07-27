// @flow
import { db } from 'db/mongodb'
import { logger } from 'utils/logger'
import { removeDeletedGamesFromUsers } from 'db/game/gameService'
const testVerifyResults = async () => {
  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  try {
    await removeDeletedGamesFromUsers()
  } catch (error) {
    logger.error(`Error removing invalid games: ${error}`)
  }

  process.exit()
}

testVerifyResults()
