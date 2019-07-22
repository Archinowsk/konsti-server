/* @flow */
import { logger } from 'utils/logger'
import { updateGamePopularity } from 'utils/updateGamePopularity'

const testUpdateGamePopularity = async () => {
  try {
    await updateGamePopularity()
  } catch (error) {
    logger.error(`updateGamePopularity error: ${error}`)
  }

  process.exit()
}

testUpdateGamePopularity()
