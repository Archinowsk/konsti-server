// @flow
import to from 'await-to-js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import moment from 'moment';
import { db } from 'db/mongodb';
import { config } from 'config';
import { logger } from 'utils/logger';
import { doAssignment } from 'player-assignment/doAssignment';
import { generateTestData } from 'test/test-data-generation/generators/generateTestData';
import { verifyUserSignups } from 'player-assignment/test/utils/verifyUserSignups';
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups';
import { verifyResults } from 'player-assignment/test/utils/verifyResults';
import { saveResults } from 'player-assignment/utils/saveResults';

let mongoServer;

const options = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, options);
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Assignment with valid data', () => {
  beforeEach(async () => {
    const newUsersCount = 20;
    const groupSize = 3;
    const numberOfGroups = 5;
    const newGamesCount = 10;
    const testUsersCount = 0;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount
    );
  });

  test('should return success with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group';
    let error, users, results;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    // FIRST RUN

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults.results));
    if (error) return logger.error(error);

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

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);

    // SECOND RUN

    const assignResults2 = await doAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults.results));
    if (error) return logger.error(error);

    [error] = await to(
      saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      )
    );
    if (error) return logger.error(error);

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);
  });

  test('should return success with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';
    let error, users, results;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    // FIRST RUN

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults.results));
    if (error) return logger.error(error);

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

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);

    // SECOND RUN

    const assignResults2 = await doAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults2.results));
    if (error) return logger.error(error);

    [error] = await to(
      saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      )
    );
    if (error) return logger.error(error);

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);
  });

  test('should return success with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';
    let error, users, results;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    // FIRST RUN

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults.results));
    if (error) return logger.error(error);

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

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);

    // SECOND RUN

    const assignResults2 = await doAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    [error] = await to(removeOverlapSignups(assignResults2.results));
    if (error) return logger.error(error);

    [error] = await to(
      saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      )
    );
    if (error) return logger.error(error);

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error] = await to(verifyUserSignups(startingTime, users));
    if (error) return logger.error(error);

    [error, results] = await to(db.results.findResult(startingTime));
    if (error) return logger.error(error);

    [error] = await to(verifyResults(startingTime, users, results));
    if (error) return logger.error(error);
  });
});

describe('Assignment with no games', () => {
  beforeEach(async () => {
    const newUsersCount = 1;
    const groupSize = 0;
    const numberOfGroups = 0;
    const newGamesCount = 0;
    const testUsersCount = 0;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount
    );
  });

  test('should return error with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no starting games');
  });
});

describe('Assignment with no players', () => {
  beforeEach(async () => {
    const newUsersCount = 0;
    const groupSize = 0;
    const numberOfGroups = 0;
    const newGamesCount = 1;
    const testUsersCount = 0;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount
    );
  });

  test('should return error with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = await doAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });
});
