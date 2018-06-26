/* @flow */
import faker from 'faker'
import { logger } from '~/utils/logger'
import db from '~/db/mongodb'
import { hashPassword } from '~/utils/bcrypt'

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
      userGroup: 'admin',
      favoritedGames: [],
      signedGames: [],
      enteredGames: [],
    }

    return db.user.saveUser(registrationData)
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
      userGroup: 'user',
      favoritedGames: [],
      signedGames: [],
      enteredGames: [],
    }

    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(error)
  }
}

const createUsersInGroup = (count: number, groupId: number) => {
  logger.info(`Generate data for ${count} users in group ${groupId}`)

  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(createUser(groupId))
  }

  return Promise.all(promises)
}

const createUser = groupId => {
  // Create users with randomized data
  // Save time by not hashing the password
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass',
    userGroup: 'user',
    playerGroup: groupId || 0,
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  }

  return db.user.saveUser(registrationData)
}

const createUsers = (count: number) => {
  logger.info(`Generate data for ${count} users`)

  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(createUser())
  }

  return Promise.all(promises)
}

export { createUsers, createAdminUser, createTestUser, createUsersInGroup }
