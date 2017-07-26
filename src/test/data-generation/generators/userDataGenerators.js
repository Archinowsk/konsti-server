const logger = require('../../../utils/logger').logger;
const db = require('../../../mongodb');
const getRandomString = require('./randomVariableGenerators').getRandomString;
const hashPassword = require('../../../utils/bcrypt').hashPassword;

const createAdminUser = () => {
  // Create admin user with predefined data
  logger.info(`Generate data for admin user "admin:test"`);

  return hashPassword('test').then(response => {
    const passwordHash = response;

    const registrationData = {
      username: 'admin',
      passwordHash,
      user_group: 'admin',
      favorited_games: [],
      signed_games: [{}],
      entered_games: [],
    };

    return db.storeUserData(registrationData);
  });
};

const createTestUser = () => {
  // Create admin user with predefined data
  logger.info(`Generate data for user "test:test"`);

  return hashPassword('test').then(response => {
    const passwordHash = response;

    const registrationData = {
      username: 'test',
      passwordHash,
      user_group: 'user',
      favorited_games: [],
      signed_games: [{}],
      entered_games: [],
    };

    return db.storeUserData(registrationData);
  });
};

const createUser = () =>
  // Create users with randomized data

  hashPassword('test').then(response => {
    const passwordHash = response;

    const registrationData = {
      username: getRandomString(10),
      passwordHash,
      user_group: 'user',
      favorited_games: [],
      signed_games: [{}],
      entered_games: [],
    };

    return db.storeUserData(registrationData);
  });

const createUsers = count => {
  logger.info(`Generate data for ${count} users`);

  return (function loop(i) {
    return new Promise(resolve => createUser().then(() => resolve())).then(
      () => i >= count || loop(i + 1)
    );
  })(1);
};

module.exports = { createUsers, createAdminUser, createTestUser };
