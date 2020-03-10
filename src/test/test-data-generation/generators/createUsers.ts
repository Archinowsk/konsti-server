import faker from 'faker';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { hashPassword } from 'utils/bcrypt';

export const createAdminUser = async (): Promise<void> => {
  logger.info(`Generate data for admin user "admin:test"`);

  const passwordHash = await hashPassword('test');

  const registrationData = {
    username: 'admin',
    passwordHash: passwordHash,
    userGroup: 'admin',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  };

  try {
    await db.user.saveUser(registrationData);
  } catch (error) {
    logger.error(error);
  }
};

export const createHelpUser = async (): Promise<void> => {
  logger.info(`Generate data for help user "ropetiski:test"`);

  const registrationData = {
    username: 'ropetiski',
    passwordHash: await hashPassword('test'),
    userGroup: 'help',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  };

  try {
    await db.user.saveUser(registrationData);
  } catch (error) {
    logger.error(error);
  }
};

const createTestUser = async (userNumber: number): Promise<void> => {
  logger.info(`Generate data for user "test${userNumber}:test"`);

  const registrationData = {
    username: `test${userNumber}`,
    passwordHash: await hashPassword('test'),
    userGroup: 'user',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  };

  try {
    await db.user.saveUser(registrationData);
  } catch (error) {
    logger.error(error);
  }
};

export const createTestUsers = (number: number) => {
  for (let i = 0; i < number; i += 1) {
    createTestUser(i + 1);
  }
};

const createUser = async ({
  groupCode,
  groupMemberCount,
}: {
  groupCode: string;
  groupMemberCount: number;
}) => {
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass', // Skip hashing to save time
    userGroup: 'user',
    serial:
      groupMemberCount === 0 ? groupCode : faker.random.number().toString(),
    groupCode,
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  };

  try {
    await db.user.saveUser(registrationData);
  } catch (error) {
    logger.error(error);
  }
};

export const createUsersInGroup = (count: number, groupCode: string) => {
  logger.info(`Generate data for ${count} users in group ${groupCode}`);

  const promises = [];
  for (let groupMemberCount = 0; groupMemberCount < count; groupMemberCount++) {
    // @ts-ignore
    promises.push(createUser({ groupCode, groupMemberCount }));
  }

  return Promise.all(promises);
};

export const createIndividualUsers = (count: number) => {
  logger.info(`Generate data for ${count} users`);

  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      // @ts-ignore
      createUser({
        groupCode: '0',
        groupMemberCount: -1,
      })
    );
  }

  return Promise.all(promises);
};
