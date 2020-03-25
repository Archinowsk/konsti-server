import 'array-flat-polyfill';
import moment from 'moment';
import { logger } from 'utils/logger';
import { runAssignment } from 'player-assignment/runAssignment';
import { db } from 'db/mongodb';
import { config } from 'config';
import { saveResults } from 'player-assignment/utils/saveResults';
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups';
import { verifyUserSignups } from 'player-assignment/test/utils/verifyUserSignups';
import { verifyResults } from 'player-assignment/test/utils/verifyResults';
import { AssignmentStrategy } from 'typings/config.typings';

const testAssignPlayers = async (
  assignmentStrategy: AssignmentStrategy
): Promise<any> => {
  const {
    CONVENTION_START_TIME,
    saveTestAssign,
    enableRemoveOverlapSignups,
  } = config;

  let users, results, assignResults;

  try {
    users = await db.user.findUsers();
  } catch (error) {
    return logger.error(error);
  }

  const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

  try {
    assignResults = await runAssignment(startingTime, assignmentStrategy);
  } catch (error) {
    return logger.error(error);
  }

  if (saveTestAssign) {
    if (enableRemoveOverlapSignups) {
      try {
        await removeOverlapSignups(assignResults.results);
      } catch (error) {
        return logger.error(error);
      }
    }

    try {
      await saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      );
    } catch (error) {
      if (error) return logger.error(error);
    }

    try {
      users = await db.user.findUsers();
    } catch (error) {
      return logger.error(error);
    }

    verifyUserSignups(startingTime, users);

    try {
      results = await db.results.findResult(startingTime);
    } catch (error) {
      return logger.error(error);
    }

    verifyResults(startingTime, users, results);
  }
};

const getAssignmentStrategy = (userParameter: string): AssignmentStrategy => {
  if (
    userParameter === 'munkres' ||
    userParameter === 'group' ||
    userParameter === 'opa' ||
    userParameter === 'group+opa'
  ) {
    // @ts-ignore
    return userParameter;
  } else {
    throw new Error(
      'Give valid strategy parameter, possible: "munkres", "group", "opa", "group+opa"'
    );
  }
};

const init = async (): Promise<any> => {
  if (process.env.NODE_ENV === 'production') {
    logger.error(`Player allocation not allowed in production`);
    return;
  }

  const userParameter = process.argv[2];

  let assignmentStrategy;
  try {
    assignmentStrategy = getAssignmentStrategy(userParameter);
  } catch (error) {
    logger.error(error);
    return;
  }

  try {
    await db.connectToDb();
  } catch (error) {
    return logger.error(error);
  }

  await testAssignPlayers(assignmentStrategy);

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

init();
