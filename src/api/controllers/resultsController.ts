import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { $Request, $Response, Middleware } from 'express';

const getResults: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/results');
  const startTime = req.query.startTime;

  if (!startTime) {
    return res.sendStatus(422);
  }

  let results;
  try {
    results = await db.results.findResult(startTime);
  } catch (error) {
    logger.error(`Results: ${error}`);
    return res.json({
      message: 'Getting results failed',
      status: 'error',
      error,
    });
  }

  if (!results) {
    return res.json({
      message: 'Getting results success',
      status: 'success',
      results: [],
      startTime: startTime,
    });
  }

  return res.json({
    message: 'Getting results success',
    status: 'success',
    results: results.results,
    startTime: results.startTime,
  });
};

export { getResults };
