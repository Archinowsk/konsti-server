// @flow
import 'array-flat-polyfill';
import to from 'await-to-js';
import moment from 'moment';
import _ from 'lodash';
import { logger } from 'utils/logger';
import { assignPlayers } from 'player-assignment/assignPlayers';
import { db } from 'db/mongodb';
import { config } from 'config';
import {
  saveResults,
  removeOverlappingSignups,
} from 'api/controllers/assignmentController';
import type { AssignmentStrategy } from 'flow/config.flow';

const testAssignPlayers = async (
  assignmentStategy: AssignmentStrategy
): Promise<any> => {
  const {
    CONVENTION_START_TIME,
    saveTestAssign,
    removeOverlapSignups,
  } = config;

  let error, users, games;

  [error, users] = await to(db.user.findUsers());
  if (error) return logger.error(error);

  [error, games] = await to(db.game.findGames());
  if (error) return logger.error(error);

  const startingTime = moment(CONVENTION_START_TIME)
    .add(2, 'hours')
    .format();

  const assignResults = await assignPlayers(
    users,
    games,
    startingTime,
    assignmentStategy
  );

  if (saveTestAssign) {
    if (removeOverlapSignups && assignResults.newSignupData) {
      [error] = await to(removeOverlappingSignups(assignResults.newSignupData));
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

    [error] = await to(verifyUserSignups(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime));
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
    return userParameter;
  } else {
    throw new Error(
      'Give valid strategy parameter, possible: "munkres", "group", "opa", "group-opa"'
    );
  }
};

const verifyUserSignups = async (startingTime: string): Promise<any> => {
  logger.info('Verify entered games and signups match for users');

  const [error, usersAfterAssign] = await to(db.user.findUsers());
  if (error) return logger.error(error);
  if (!usersAfterAssign) return;

  usersAfterAssign.map(user => {
    const enteredGames = user.enteredGames.filter(
      enteredGame =>
        moment(enteredGame.time).format() === moment(startingTime).format()
    );

    if (!enteredGames || enteredGames.length === 0) return;

    if (enteredGames.length !== 1) {
      logger.error(
        `Too many entered games for time ${startingTime}: ${user.username} - ${enteredGames.length} games`
      );
      return;
    }

    const enteredGame = _.first(enteredGames);

    if (user.signedGames && user.signedGames.length !== 0) {
      const signupFound = user.signedGames.find(signedGame => {
        return (
          signedGame.gameDetails.gameId === enteredGame.gameDetails.gameId &&
          moment(signedGame.time).format() === moment(enteredGame.time).format()
        );
      });

      if (!signupFound) {
        logger.error(
          `Signup not found: ${user.username} - ${enteredGame.gameDetails.title}`
        );
      } else {
        logger.debug(
          `Signup found: ${user.username} - ${enteredGame.gameDetails.title}`
        );
      }
    }
  });
};

const verifyResults = async (startingTime: string): Promise<any> => {
  logger.info('Verify results contain valid data');

  const [error, results] = await to(db.results.findResult(startingTime));
  if (error) return logger.error(error);

  if (!results || !results.result) {
    logger.error('No results found');
    return;
  }

  results.result.map(result => {
    if (
      moment(result.enteredGame.time).format() !== moment(startingTime).format()
    ) {
      logger.error(
        `Invalid time for "${
          result.enteredGame.gameDetails.title
        }" - actual: ${moment(
          result.enteredGame.time
        ).format()}, expected: ${startingTime}`
      );
    }
  });
};

const init = async (): Promise<any> => {
  if (process.env.NODE_ENV === 'production') {
    logger.error(`Player allocation not allowed in production`);
    return;
  }

  const userParameter = process.argv[2];

  let assignmentStategy;
  try {
    assignmentStategy = getAssignmentStrategy(userParameter);
  } catch (error) {
    logger.error(error);
    return;
  }

  let error;

  [error] = await to(db.connectToDb());
  if (error) return logger.error(error);

  await testAssignPlayers(assignmentStategy);

  [error] = await to(db.gracefulExit());
  if (error) logger.error(error);
};

init();
