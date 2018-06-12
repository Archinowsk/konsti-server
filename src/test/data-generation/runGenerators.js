const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const createUsers = require('./generators/userDataGenerators').createUsers
const createAdminUser = require('./generators/userDataGenerators')
  .createAdminUser
const createTestUser = require('./generators/userDataGenerators').createTestUser
const createGames = require('./generators/gameDataGenerators').createGames
const createSignupData = require('./generators/signupDataGenerators')
  .createSignupData
const config = require('../../../config')

const generators = async () => {
  if (config.env !== 'development') {
    logger.error(
      `Data cretion only allowed in dev environment, current env "${
        config.env
      }"`
    )
    process.exit()
  }

  const newUsersCount = 10 // How many players exist overall, add +2 for test accounts
  const newGamesCount = 15 // How many games are availale for signup - minimum is 3
  const newSignupsCount = 10 // How many players will sign up for three games

  try {
    await db.connectToDb()
    await db.removeUsers()
    await db.removeGames()
    await db.removeResults()
    await db.removeSettings()
    await createAdminUser()
    await createTestUser()
    await createUsers(newUsersCount)
    await createGames(newGamesCount)
    await createSignupData(newSignupsCount)
  } catch (error) {
    logger.error(error)
  }

  process.exit()
}

generators()
