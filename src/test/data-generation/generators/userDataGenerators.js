/* @flow */
import faker from 'faker'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { hashPassword } from 'utils/bcrypt'

const createAdminUser = async () => {
  // Create admin user with predefined data
  logger.info(`Generate data for admin user "admin:test"`)

  const passwordHash = await hashPassword('test')

  const registrationData = {
    username: 'admin',
    passwordHash: passwordHash,
    userGroup: 'admin',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    registerDescription: true,
  }

  try {
    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(error)
  }
}

const createTestUser = async (userNumber: number) => {
  logger.info(`Generate data for user "test${userNumber}:test"`)

  const passwordHash = await hashPassword('test')

  const registrationData = {
    username: `test${userNumber}`,
    passwordHash,
    userGroup: 'user',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    registerDescription: true,
  }

  try {
    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(error)
  }
}

const createTestUsers = async (number: number) => {
  // Create test users with predefined data
  for (let i = 0; i < number; i += 1) {
    createTestUser(i + 1)
  }
}

const createUserInGroup = (groupId: string, index: number) => {
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass', // Skip hashing to save time
    userGroup: 'user',
    serial: index === 0 ? groupId : faker.random.number().toString(),
    playerGroup: groupId,
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    registerDescription: true,
  }

  return db.user.saveUser(registrationData)
}

const createUsersInGroup = (count: number, groupId: string) => {
  logger.info(`Generate data for ${count} users in group ${groupId}`)

  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(createUserInGroup(groupId, i))
  }

  return Promise.all(promises)
}

const createUser = () => {
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass', // Skip hashing to save time
    userGroup: 'user',
    serial: faker.random.number().toString(),
    playerGroup: '0',
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
    registerDescription: true,
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

export { createUsers, createAdminUser, createTestUsers, createUsersInGroup }
