import { logger } from '../utils/logger'
import assignPlayers from '../player-assignment/assignPlayers'
import db from '../db/mongodb'
import config from '../config'

const testAssignPlayers = async () => {
  const strategy = process.argv[2]

  if (!strategy || (strategy !== 'munkres' && strategy !== 'group')) {
    logger.error('Give strategy parameter, possible: "munkres", "group"')
    process.exit()
  }

  if (config.env !== 'development') {
    logger.error(
      `Player allocation only allowed in dev environment, current env "${
        config.env
      }"`
    )
    process.exit()
  }

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(error)
  }

  let users = []
  let games = []
  try {
    users = await db.user.findUsers()
    games = await db.game.findGames()
  } catch (error) {
    logger.error(error)
  }
  const startingTime = '2017-07-28T16:00:00.000Z'

  const result = await assignPlayers(users, games, startingTime, strategy)

  logger.info(`Result: ${JSON.stringify(result)}`)

  process.exit()
}

testAssignPlayers()
