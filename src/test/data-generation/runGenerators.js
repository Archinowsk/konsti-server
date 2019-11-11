// @flow
import 'array-flat-polyfill';
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { generateTestData } from 'test/data-generation/generators/generateTestData';

const runGenerators = async (): Promise<void> => {
  let error;
  const strategy = process.argv[2];

  if (!strategy || (strategy !== 'munkres' && strategy !== 'group')) {
    throw new Error('Give strategy parameter, possible: "munkres", "group"');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Data creation not allowed in production`);
  }

  // Total users: newUsersCount + groupSize * numberOfGroups + testUsersCount
  let newUsersCount = 0; // Number of individual users
  let groupSize = 0; // How many users in each group
  let numberOfGroups = 0; // Number of groups
  let testUsersCount = 0; // Number of test users

  let newGamesCount = 0; // How many games are availale for each signup time - minimum is 3

  if (strategy === 'munkres') {
    newUsersCount = 20;
    newGamesCount = 10;
    testUsersCount = 5;
  } else if (strategy === 'group') {
    newUsersCount = 40;
    groupSize = 3;
    numberOfGroups = 15;
    newGamesCount = 10;
    testUsersCount = 5;
  }

  [error] = await to(db.connectToDb());
  if (error) logger.error(error);

  [error] = await to(db.user.removeUsers());
  if (error) logger.error(error);

  [error] = await to(db.game.removeGames());
  if (error) logger.error(error);

  [error] = await to(db.results.removeResults());
  if (error) logger.error(error);

  [error] = await to(db.settings.removeSettings());
  if (error) logger.error(error);

  logger.info(`MongoDB: Generate new data with "${strategy}" strategy`);

  [error] = await to(
    generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount
    )
  );
  if (error) logger.error(error);

  [error] = await to(db.gracefulExit());
  if (error) logger.error(error);
};

runGenerators();
