// @flow
import 'array-flat-polyfill';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { generateTestData } from 'test/data-generation/generators/generateTestData';

const runGenerators = async (): Promise<any> => {
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

  try {
    await db.connectToDb();
  } catch (error) {
    logger.error(error);
  }

  try {
    logger.info(`MongoDB: Clean old data`);
    await db.user.removeUsers();
    await db.game.removeGames();
    await db.results.removeResults();
    await db.settings.removeSettings();
  } catch (error) {
    logger.error(`MongoDB: Clean old data error: ${error}`);
  }

  logger.info(`MongoDB: Generate new data with "${strategy}" strategy`);

  try {
    await generateTestData(
      newUsersCount,
      newGamesCount,
      groupSize,
      numberOfGroups,
      testUsersCount
    );
  } catch (error) {
    logger.error(`generateTestData error: ${error}`);
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

runGenerators();
