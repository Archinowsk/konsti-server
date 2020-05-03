import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import moment from 'moment';
import { db } from 'db/mongodb';
import { config } from 'config';
import { logger } from 'utils/logger';
import { runAssignment } from 'player-assignment/runAssignment';
import { generateTestData } from 'test/test-data-generation/generators/generateTestData';
import { verifyUserSignups } from 'player-assignment/test/utils/verifyUserSignups';
import { removeOverlapSignups } from 'player-assignment/utils/removeOverlapSignups';
import { verifyResults } from 'player-assignment/test/utils/verifyResults';
import { saveResults } from 'player-assignment/utils/saveResults';
import { AssignmentStrategy } from 'typings/config.typings';

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
    const signupTimes = 3;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount,
      signupTimes
    );
  });

  test('should return success with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.group;

    let users;
    let results;

    try {
      users = await db.user.findUsers();
    } catch (error) {
      return logger.error(error);
    }

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    // FIRST RUN

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      );
    } catch (error) {
      return logger.error(error);
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

    // SECOND RUN

    const assignResults2 = await runAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      );
    } catch (error) {
      return logger.error(error);
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
  });

  test('should return success with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.opa;
    let users, results;

    try {
      users = await db.user.findUsers();
    } catch (error) {
      return logger.error(error);
    }

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    // FIRST RUN

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      );
    } catch (error) {
      return logger.error(error);
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

    // SECOND RUN

    const assignResults2 = await runAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults2.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      );
    } catch (error) {
      return logger.error(error);
    }

    try {
      users = await db.user.findUsers();
    } catch (error) {
      if (error) return logger.error(error);
    }

    verifyUserSignups(startingTime, users);

    try {
      results = await db.results.findResult(startingTime);
    } catch (error) {
      return logger.error(error);
    }

    verifyResults(startingTime, users, results);
  });

  test('should return success with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.groupOpa;
    let users, results;

    try {
      users = await db.user.findUsers();
    } catch (error) {
      return logger.error(error);
    }

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    // FIRST RUN

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults.results,
        startingTime,
        assignResults.algorithm,
        assignResults.message
      );
    } catch (error) {
      return logger.error(error);
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

    // SECOND RUN

    const assignResults2 = await runAssignment(startingTime);

    expect(assignResults2.status).toEqual('success');

    try {
      await removeOverlapSignups(assignResults2.results);
    } catch (error) {
      return logger.error(error);
    }

    try {
      await saveResults(
        assignResults2.results,
        startingTime,
        assignResults2.algorithm,
        assignResults2.message
      );
    } catch (error) {
      return logger.error(error);
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
  });
});

describe('Assignment with no games', () => {
  beforeEach(async () => {
    const newUsersCount = 1;
    const groupSize = 0;
    const numberOfGroups = 0;
    const newGamesCount = 0;
    const testUsersCount = 0;
    const signupTimes = 3;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount,
      signupTimes
    );
  });

  test('should return error with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.group;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.opa;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.groupOpa;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

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
    const signupTimes = 3;

    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount,
      signupTimes
    );
  });

  test('should return error with group strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.group;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.opa;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = AssignmentStrategy.groupOpa;

    const startingTime = moment(CONVENTION_START_TIME).add(2, 'hours').format();

    const assignResults = await runAssignment(startingTime, assignmentStrategy);

    expect(assignResults.status).toEqual('error: no signup wishes');
  });
});
