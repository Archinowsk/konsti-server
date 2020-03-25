import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { Result } from 'typings/result.typings';

export const saveUserSignupResults = async (
  results: readonly Result[]
): Promise<void> => {
  try {
    await Promise.all(
      results.map(async (result) => {
        await db.user.saveSignupResult(result);
      })
    );
  } catch (error) {
    logger.error(`saveSignupResult error: ${error}`);
    throw new Error('No assign results');
  }
};
