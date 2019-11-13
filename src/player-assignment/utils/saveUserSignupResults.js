// @flow
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import type { Result } from 'flow/result.flow';

export const saveUserSignupResults = async (
  results: $ReadOnlyArray<Result>
): Promise<void> => {
  try {
    await Promise.all(
      results.map(async result => {
        await db.user.saveSignupResult(result);
      })
    );
  } catch (error) {
    logger.error(`saveSignupResult error: ${error}`);
    throw new Error('No assign results');
  }
};
