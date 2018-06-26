/* @flow */
import { logger } from '~/utils/logger'
import db from '~/db/mongodb'
import munkresGenerator from '~/test/data-generation/munkresGenerator'
import groupGenerator from '~/test/data-generation/groupGenerator'

import config from '~/config'

const runGenerators = async () => {
  const strategy = process.argv[2]

  if (!strategy || (strategy !== 'munkres' && strategy !== 'group')) {
    logger.error('Give strategy parameter, possible: "munkres", "group"')
    process.exit()
  }

  if (config.env !== 'development') {
    logger.error(
      `Data creation only allowed in dev environment, current env "${
        config.env
      }"`
    )
    process.exit()
  }

  // Total users: newUsersCount + 2 + groupSize * numberOfGroups

  const newUsersCount = 10 // How many players exist overall, add +2 for test accounts
  const newGamesCount = 5 // How many games are availale for signup - minimum is 3
  const groupSize = 3 // How many new users will be in each group
  const numberOfGroups = 2 // How many groups are created

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
