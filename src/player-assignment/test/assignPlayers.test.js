// @flow
import to from 'await-to-js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import moment from 'moment';
import { db } from 'db/mongodb';
import { config } from 'config';
import { logger } from 'utils/logger';
import { assignPlayers } from 'player-assignment/assignPlayers';
import { generateTestData } from 'test/test-data-generation/generators/generateTestData';

jest.setTimeout(30000);

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
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('success');
  });

  test('should return success with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('success');
  });

  test('should return success with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('success');
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
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('error: no starting games');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

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
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('error: no signup wishes');
  });

  test('should return error with group+opa strategy', async () => {
    const { CONVENTION_START_TIME } = config;

    const assignmentStrategy = 'group+opa';
    let error, users, games;

    [error, users] = await to(db.user.findUsers());
    if (error) return logger.error(error);

    [error, games] = await to(db.game.findGames());
    if (error) return logger.error(error);

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format();

    const assignResults = assignPlayers(
      users,
      games,
      startingTime,
      assignmentStrategy
    );

    expect(assignResults.status).toEqual('error: no signup wishes');
  });
});
