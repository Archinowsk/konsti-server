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

export const groupGenerator = async (
  newUsersCount: number,
  newGamesCount: number,
  groupSize: number,
  numberOfGroups: number
): Promise<any> => {
  const { generateSignups } = config;

  await createAdminUser();
  await createHelpUser();
  await createTestUsers(5);
  await createUsers(newUsersCount);

  for (let i = 0; i < numberOfGroups; i++) {
    const randomGroupId = faker.random.number().toString();
    await createUsersInGroup(groupSize, randomGroupId);
  }

  await createGames(newGamesCount);

  if (generateSignups) {
    await createSignups('group');
  }
};
