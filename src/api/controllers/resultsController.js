/* @flow */
const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')

// Get settings
const getResults = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/results')

  let response = null
  try {
    response = await db.results.getResults()
    res.json({
      message: 'Getting results success',
      status: 'success',
      results: response,
    })
  } catch (error) {
    logger.error(`Settings: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }
}

module.exports = { getResults }
