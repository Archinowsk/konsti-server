/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'
import munkresGenerator from 'test/data-generation/munkresGenerator'
import groupGenerator from 'test/data-generation/groupGenerator'

const runGenerators = async () => {
  const strategy = process.argv[2]

  if (!strategy || (strategy !== 'munkres' && strategy !== 'group')) {
    logger.error('Give strategy parameter, possible: "munkres", "group"')
    process.exit()
  }

  if (process.env.NODE_ENV === 'production') {
    logger.error(`Data creation not allowed in production`)
    process.exit()
  }

  // Total users: newUsersCount + 2 test accounts + groupSize * numberOfGroups
  const newUsersCount = 10 // Number of individual users
  const groupSize = 3 // How many users in each group
  const numberOfGroups = 6 // Number of groups

  // How many games are availale for signup - minimum is 3
  const newGamesCount = 10

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(error)
  }

  try {
    logger.info(`MongoDB: Clean old data`)
    await db.user.removeUsers()
    await db.game.removeGames()
    await db.results.removeResults()
    await db.settings.removeSettings()
  } catch (error) {
    logger.error(error)
  }

  logger.info(`MongoDB: Generate new data with "${strategy}" strategy`)

  try {
    if (strategy === 'munkres') {
      await munkresGenerator(newUsersCount, newGamesCount)
    } else if (strategy === 'group') {
      await groupGenerator(
        newUsersCount,
        newGamesCount,
        groupSize,
        numberOfGroups
      )
    }
  } catch (error) {
    logger.error(error)
  }

  process.exit()
}

runGenerators()
