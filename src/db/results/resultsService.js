// @flow
import { logger } from 'utils/logger';
import { Results } from 'db/results/resultsSchema';
import type { Result } from 'flow/result.flow';

const removeResults = () => {
  logger.info('MongoDB: remove ALL results from db');
  return Results.deleteMany({});
};

const findResult = async (startTime: string): Promise<any> => {
  let response = null;
  try {
    response = await Results.findOne(
      { startTime },
      '-_id -__v -createdAt -updatedAt -result._id'
    )
      .lean()
      .sort({ createdAt: -1 })
      .populate('result.enteredGame.gameDetails');
    logger.debug(`MongoDB: Results data found for time ${startTime}`);
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error finding results data for time ${startTime} - ${error}`
    );
    return error;
  }
};

const saveResult = async (
  signupResultData: $ReadOnlyArray<Result>,
  startTime: string,
  algorithm: string,
  message: string
): Promise<any> => {
  const result = signupResultData.map(result => {
    return {
      username: result.username,
      enteredGame: {
        gameDetails: result.enteredGame.gameDetails._id,
        priority: result.enteredGame.priority,
        time: result.enteredGame.time,
      },
    };
  });

  let response = null;
  try {
    response = await Results.replaceOne(
      { startTime },
      { startTime, result, algorithm, message },
      { upsert: true }
    );
    logger.debug(
      `MongoDB: Signup results for starting time ${startTime} stored to separate collection`
    );
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup results for starting time ${startTime} to separate collection - ${error}`
    );
    return error;
  }
};

export const results = { removeResults, saveResult, findResult };
