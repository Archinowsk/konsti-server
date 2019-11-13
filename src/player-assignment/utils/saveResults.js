// @flow
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { saveUserSignupResults } from 'player-assignment/utils/saveUserSignupResults';
import type { Result } from 'flow/result.flow';

export const saveResults = async (
  results: $ReadOnlyArray<Result>,
  startingTime: string,
  algorithm: string,
  message: string
): Promise<void> => {
  try {
    logger.info(
      `Save all signup results to separate collection for starting time ${startingTime}`
    );
    await db.results.saveResult(results, startingTime, algorithm, message);
  } catch (error) {
    throw new Error(`No assign results: db.results.saveResult error: ${error}`);
  }

  try {
    logger.info(`Save user signup results for starting time ${startingTime}`);
    await saveUserSignupResults(results);
  } catch (error) {
    logger.error(`saveUserSignupResults: ${error}`);
    throw new Error(`No assign results: saveUserSignupResults: ${error}`);
  }
};
