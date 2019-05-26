/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'

const getResults = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/results')
  const startTime = req.query.startTime

  if (!startTime) {
    res.sendStatus(422)
    return
  }

  let results
  try {
    results = await db.results.findResults(startTime)
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    })
  }

  if (!results) {
    res.json({
      message: 'Getting results success',
      status: 'success',
      results: null,
    })
    return
  }

  res.json({
    message: 'Getting results success',
    status: 'success',
    results,
  })
}

export { getResults }
