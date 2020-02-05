import { logger } from 'utils/logger';
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups';
import { saveResults } from 'player-assignment/utils/saveResults';
import { runAssignment } from 'player-assignment/runAssignment';
import { validateAuthHeader } from 'utils/authHeader';
import { config } from 'config';
import { $Request, $Response, Middleware } from 'express';

// Assign players to games
const postAssignment: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/assignment');
  const startingTime = req.body.startingTime;

  const authHeader = req.headers.authorization;
  // @ts-ignore
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    return res.sendStatus(401);
  }

  if (!startingTime) {
    return res.json({
      message: 'Invalid starting time',
      status: 'error',
    });
  }

  let assignResults = null;
  try {
    // @ts-ignore
    assignResults = await runAssignment(startingTime);
  } catch (error) {
    logger.error(`Player assign error: ${error}`);
    return res.json({
      message: 'Players assign failure',
      status: 'error',
    });
  }

  // @ts-ignore
  if (!assignResults || !assignResults.results) {
    return res.json({
      message: 'Players assign failure',
      status: 'error',
    });
  }

  try {
    await saveResults(
      // @ts-ignore
      assignResults.results,
      startingTime,
      // @ts-ignore
      assignResults.algorithm,
      // @ts-ignore
      assignResults.message
    );
  } catch (error) {
    logger.error(`saveResult error: ${error}`);
    return res.json({
      message: 'Players assign failure',
      status: 'error',
      error,
    });
  }

  // Remove overlapping signups
  if (config.enableRemoveOverlapSignups) {
    try {
      logger.info('Remove overlapping signups');
      // @ts-ignore
      await removeOverlapSignups(assignResults.results);
    } catch (error) {
      logger.error(`removeOverlapSignups error: ${error}`);
      return res.json({
        message: 'Players assign failure',
        status: 'error',
        error,
      });
    }
  }

  return res.json({
    message: 'Players assign success',
    status: 'success',
    // @ts-ignore
    results: assignResults.results,
    // @ts-ignore
    resultMessage: assignResults.message,
    startTime: startingTime,
  });
};

export { postAssignment };
