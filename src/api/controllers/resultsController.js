/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import type { $Request, $Response, Middleware } from 'express'

const getResults: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/results')
  const startTime = req.query.startTime

  if (!startTime) {
    res.sendStatus(422)
    return
  }

  let results
  try {
    results = await db.results.findResult(startTime)
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
