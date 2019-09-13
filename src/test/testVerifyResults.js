// @flow
import { db } from 'db/mongodb'
import { logger } from 'utils/logger'
import { verifyResults } from 'test/verifyResults'

const testVerifyResults = async () => {
  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  const startTime = '2019-07-26 14:00:00.000Z'

  try {
    await verifyResults(startTime)
  } catch (error) {
    logger.error(`Error verifying results for time ${startTime}: ${error}`)
  }

  try {
    await db.gracefulExit()
  } catch (error) {
    logger.error(error)
  }
}

testVerifyResults()
