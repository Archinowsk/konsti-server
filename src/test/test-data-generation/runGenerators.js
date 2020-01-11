// @flow
import 'array-flat-polyfill';
import to from 'await-to-js';
import commander from 'commander';
import faker from 'faker';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import {
  createIndividualUsers,
  createAdminUser,
  createTestUsers,
  createUsersInGroup,
  createHelpUser,
} from 'test/test-data-generation/generators/createUsers';
import { createGames } from 'test/test-data-generation/generators/createGames';
import { createSignups } from 'test/test-data-generation/generators/createSignups';

const runGenerators = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Data creation not allowed in production`);
  }

  let error;

  // Total users: newUsersCount + groupSize * numberOfGroups + testUsersCount
  const newUsersCount = 40; // Number of individual users
  const groupSize = 3; // How many users in each group
  const numberOfGroups = 15; // Number of groups
  const testUsersCount = 5; // Number of test users

  // Total games: newGamesCount * signupTimes
  const newGamesCount = 10; // How many games are available for each signup time
  const signupTimes = 3; // For how many signup times games are created

  commander
    .option('-u, --users', 'Generate users')
    .option('-s, --signups', 'Generate signups')
    .option('-g, --games', 'Generate games')
    .option('-c, --clean', 'Clean all data');

  if (process.argv.length < 3) {
    commander.help();
  }

  commander.parse(process.argv);

  [error] = await to(db.connectToDb());
  if (error) logger.error(error);

  if (commander.clean) {
    logger.info('Clean all data');

    [error] = await to(db.user.removeUsers());
    if (error) logger.error(error);

    [error] = await to(db.game.removeGames());
    if (error) logger.error(error);

    [error] = await to(db.results.removeResults());
    if (error) logger.error(error);

    [error] = await to(db.settings.removeSettings());
    if (error) logger.error(error);
  }

  if (commander.users) {
    logger.info('Generate users');

    [error] = await to(db.user.removeUsers());
    if (error) logger.error(error);

    await createAdminUser();
    await createHelpUser();

    if (testUsersCount) await createTestUsers(testUsersCount);
    if (newUsersCount) await createIndividualUsers(newUsersCount);

    for (let i = 0; i < numberOfGroups; i++) {
      const randomGroupCode = faker.random.number().toString();
      await createUsersInGroup(groupSize, randomGroupCode);
    }
  }

  if (commander.games) {
    logger.info('Generate games');

    [error] = await to(db.game.removeGames());
    if (error) logger.error(error);

    await createGames(newGamesCount, signupTimes);
  }

  if (commander.signups) {
    logger.info('Generate signups');
    // TODO: Remove signups
    await createSignups();
  }

  [error] = await to(db.gracefulExit());
  if (error) logger.error(error);
};

runGenerators();
