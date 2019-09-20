// @flow
import faker from 'faker'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { hashPassword } from 'utils/bcrypt'

export const createAdminUser = async (): Promise<any> => {
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
  }

  try {
    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(`db.game.saveUser error: ${error}`)
  }
}

export const createHelpUser = async (): Promise<any> => {
  // Create admin user with predefined data
  logger.info(`Generate data for help user "ropetiski:test"`)

  const passwordHash = await hashPassword('test')

  const registrationData = {
    username: 'ropetiski',
    passwordHash: passwordHash,
    userGroup: 'help',
    serial: faker.random.number(10000000).toString(),
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  }

  try {
    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(`db.game.saveUser error: ${error}`)
  }
}

const createTestUser = async (userNumber: number): Promise<any> => {
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
  }

  try {
    return db.user.saveUser(registrationData)
  } catch (error) {
    logger.error(`db.game.saveUser error: ${error}`)
  }
}

export const createTestUsers = async (number: number): Promise<any> => {
  // Create test users with predefined data
  for (let i = 0; i < number; i += 1) {
    createTestUser(i + 1)
  }
}

const createUserInGroup = (groupCode: string, index: number): Promise<any> => {
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass', // Skip hashing to save time
    userGroup: 'user',
    serial: index === 0 ? groupCode : faker.random.number().toString(),
    groupCode,
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  }

  return db.user.saveUser(registrationData)
}

export const createUsersInGroup = (
  count: number,
  groupId: string
): Promise<any> => {
  logger.info(`Generate data for ${count} users in group ${groupId}`)

  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(createUserInGroup(groupId, i))
  }

  return Promise.all(promises)
}

const createUser = (): Promise<any> => {
  const registrationData = {
    username: faker.internet.userName(),
    passwordHash: 'testPass', // Skip hashing to save time
    userGroup: 'user',
    serial: faker.random.number().toString(),
    groupCode: '0',
    favoritedGames: [],
    signedGames: [],
    enteredGames: [],
  }

  return db.user.saveUser(registrationData)
}

export const createUsers = (count: number): Promise<any> => {
  logger.info(`Generate data for ${count} users`)

  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(createUser())
  }

  return Promise.all(promises)
}
