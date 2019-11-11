// @flow
import faker from 'faker';
import {
  createUsers,
  createAdminUser,
  createTestUsers,
  createUsersInGroup,
  createHelpUser,
} from 'test/data-generation/generators/createUsers';
import { createGames } from 'test/data-generation/generators/createGames';
import { createSignups } from 'test/data-generation/generators/createSignups';
import { config } from 'config';

export const generateTestData = async (
  newUsersCount: number,
  newGamesCount: number,
  groupSize: number,
  numberOfGroups: number,
  testUsersCount: number
): Promise<any> => {
  const { generateSignups } = config;

  await createAdminUser();
  await createHelpUser();

  if (testUsersCount) await createTestUsers(testUsersCount);
  if (newUsersCount) await createUsers(newUsersCount);

  for (let i = 0; i < numberOfGroups; i++) {
    const randomGroupId = faker.random.number().toString();
    await createUsersInGroup(groupSize, randomGroupId);
  }

  await createGames(newGamesCount);

  if (generateSignups) {
    await createSignups();
  }
};
