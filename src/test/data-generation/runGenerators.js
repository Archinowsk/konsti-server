const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const munkresGenerator = require('./munkresGenerator')
const groupGenerator = require('./groupGenerator')

const config = require('../../../config')

const runGenerators = async () => {
  const strategy = process.argv[2]

  if (!strategy && strategy !== 'munkres' && strategy !== 'group') {
    logger.error('Give strategy parameter, possible: "munkres", "group"')
    process.exit()
  }

  if (config.env !== 'development') {
    logger.error(
      `Data cretion only allowed in dev environment, current env "${
        config.env
      }"`
    )
    process.exit()
  }

  const newUsersCount = 20 // How many players exist overall, add +2 for test accounts
  const newGamesCount = 5 // How many games are availale for signup - minimum is 3
  const newSignupsCount = 20 // How many players will sign up for three games

  try {
    await db.connectToDb()

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
      await munkresGenerator(newUsersCount, newGamesCount, newSignupsCount)
    } else if (strategy === 'group') {
      await groupGenerator(newUsersCount, newGamesCount, newSignupsCount)
    }
  } catch (error) {
    logger.error(error)
  }

  process.exit()
}

runGenerators()
