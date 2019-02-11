/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'

// Get results
const getResults = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/results')

  let response = null
  try {
    response = await db.results.findResults()
    res.json({
      message: 'Getting results success',
      status: 'success',
      results: response,
    })
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }
}

export { getResults }
