// @flow
import { logger } from 'utils/logger';
import { removeOverlappingSignups } from 'player-assignment/utils/removeOverlappingSignups';
import { saveResults } from 'player-assignment/utils/saveResults';
import { doAssignment } from 'player-assignment/utils/doAssignment';
import { validateAuthHeader } from 'utils/authHeader';
import { config } from 'config';
import type { $Request, $Response, Middleware } from 'express';

// Assign players to games
const postAssignment: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/assignment');
  const startingTime = req.body.startingTime;

  const authHeader = req.headers.authorization;
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
    assignResults = await doAssignment(startingTime);
  } catch (error) {
    return res.json({
      message: 'Players assign failure',
      status: 'error',
    });
  }

  if (!assignResults || !assignResults.results) {
    return res.json({
      message: 'Players assign failure',
      status: 'error',
    });
  }

  try {
    await saveResults(
      assignResults.results,
      startingTime,
      assignResults.algorithm,
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
  if (config.enableRemoveOverlapSignups && assignResults.newSignupData) {
    try {
      logger.info('Remove overlapping signups');
      await removeOverlappingSignups(assignResults.newSignupData);
    } catch (error) {
      logger.error(`removeOverlappingSignups error: ${error}`);
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
    results: assignResults.results,
    resultMessage: assignResults.message,
    signups: assignResults.newSignupData,
    startTime: startingTime,
  });
};

export { postAssignment };
