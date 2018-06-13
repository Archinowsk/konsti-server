const { logger } = require('../../../utils/logger')
const db = require('../../../db/mongodb')
const getRandomString = require('./randomVariableGenerators').getRandomString
const hashPassword = require('../../../utils/bcrypt').hashPassword

const createAdminUser = async () => {
  // Create admin user with predefined data
  logger.info(`Generate data for admin user "admin:test"`)

  let response = null
  try {
    response = await hashPassword('test')
    const passwordHash = response

    const registrationData = {
      username: 'admin',
      passwordHash,
      user_group: 'admin',
      favorited_games: [],
      signed_games: [{}],
      entered_games: [],
    }

    return db.user.storeUserData(registrationData)
  } catch (error) {
    logger.error(error)
  }
}

const createTestUser = async () => {
  // Create admin user with predefined data
  logger.info(`Generate data for user "test:test"`)

  let response = null
  try {
    response = await hashPassword('test')
    const passwordHash = response

    const registrationData = {
      username: 'test',
      passwordHash,
      user_group: 'user',
      favorited_games: [],
      signed_games: [{}],
      entered_games: [],
    }

    return db.user.storeUserData(registrationData)
  } catch (error) {
    logger.error(error)
  }
}

const createUser = () => {
  // Create users with randomized data
  // Save time by not hashing the password
  const registrationData = {
    username: getRandomString(10),
    passwordHash: 'testPass',
    user_group: 'user',
    favorited_games: [],
    signed_games: [{}],
    entered_games: [],
  }

  return db.user.storeUserData(registrationData)
}

const createUsers = count => {
  logger.info(`Generate data for ${count} users`)

  const promises = []
  for (let i = 0; i < 10; i++) {
    promises.push(createUser())
  }

  return Promise.all(promises)
}

module.exports = { createUsers, createAdminUser, createTestUser }
