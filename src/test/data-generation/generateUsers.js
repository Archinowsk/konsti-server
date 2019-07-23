/* @flow */
import faker from 'faker'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import {
  createUsers,
  createAdminUser,
  createTestUsers,
  createUsersInGroup,
} from 'test/data-generation/generators/createUsers'
import { createSignups } from 'test/data-generation/generators/createSignups'
import { config } from 'config'
import { updateGames } from 'utils/updateGames'

const generateUsers = async (): Promise<any> => {
  const newUsersCount = 10
  const numberOfGroups = 3
  const groupSize = 3

  const { generateSignups } = config

  if (process.env.NODE_ENV === 'production') {
    logger.error(`Signup creation not allowed in production`)
    process.exit()
  }

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  try {
    logger.info(`MongoDB: Clean old user and results data`)
    await db.user.removeUsers()
    await db.results.removeResults()
  } catch (error) {
    logger.error(`MongoDB: Clean old data error: ${error}`)
  }

  logger.info(`Update games from remote server`)

  let kompassiGames = []
  try {
    kompassiGames = await updateGames()
  } catch (error) {
    logger.error(`updateGames error: ${error}`)
    throw new Error(`updateGames error: ${error}`)
  }

  logger.info(`Games updated, found ${kompassiGames.length} games`)

  logger.info(`MongoDB: Generate new signup data`)

  await createAdminUser()
  await createTestUsers(2)
  await createUsers(newUsersCount)

  for (let i = 0; i < numberOfGroups; i++) {
    const randomGroupId = faker.random.number().toString()
    await createUsersInGroup(groupSize, randomGroupId)
  }

  if (generateSignups) {
    await createSignups('group')
  }

  process.exit()
}

generateUsers()
