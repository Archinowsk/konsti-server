import 'array-flat-polyfill';
import to from 'await-to-js';
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

  let error, users, results, assignResults;

  [error, users] = await to(db.user.findUsers());
  if (error) return logger.error(error);

  const startingTime = moment(CONVENTION_START_TIME)
    .add(2, 'hours')
    .format();

  [error, assignResults] = await to(
    runAssignment(startingTime, assignmentStrategy)
  );
  if (error) return logger.error(error);

  if (saveTestAssign) {
    if (enableRemoveOverlapSignups) {
      [error] = await to(removeOverlapSignups(assignResults.results));
      if (error) return logger.error(error);
    }

    [error] = await to(
      saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      )
    );
    if (error) return logger.error(error);

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    verifyUserSignups(startingTime, users);
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    verifyResults(startingTime, users, results);
    if (error) return logger.error(error);
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

  let error;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  await testAssignPlayers(assignmentStrategy);

  [error] = await to(db.gracefulExit());
  if (error) logger.error(error);
};

init();
