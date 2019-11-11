// @flow
import faker from 'faker';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import {
  createUsers,
  createAdminUser,
  createTestUsers,
  createUsersInGroup,
  createHelpUser,
} from 'test/data-generation/generators/createUsers';
import { createSignups } from 'test/data-generation/generators/createSignups';
import { config } from 'config';
import { updateGames } from 'utils/updateGames';

const generateUsers = async (): Promise<any> => {
  const newUsersCount = 10;
  const numberOfGroups = 3;
  const groupSize = 3;

  const { generateSignups } = config;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Signup creation not allowed in production`);
  }

  try {
    await db.connectToDb();
  } catch (error) {
    logger.error(error);
  }

  try {
    await db.user.removeUsers();
    await db.results.removeResults();
  } catch (error) {
    logger.error(`MongoDB: Clean old data error: ${error}`);
  }

  logger.info(`Update games from remote server`);

  let games = [];
  try {
    games = await updateGames();
  } catch (error) {
    throw new Error(`updateGames error: ${error}`);
  }

  try {
    await db.game.saveGames(games);
  } catch (error) {
    throw new Error(`db.game.saveGames error: ${error}`);
  }

  logger.info(`Games updated, found ${games.length} games`);

  logger.info(`MongoDB: Generate new signup data`);

  await createAdminUser();
  await createHelpUser();
  await createTestUsers(5);
  await createUsers(newUsersCount);

  for (let i = 0; i < numberOfGroups; i++) {
    const randomGroupId = faker.random.number().toString();
    await createUsersInGroup(groupSize, randomGroupId);
  }

  if (generateSignups) {
    await createSignups();
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

generateUsers();
