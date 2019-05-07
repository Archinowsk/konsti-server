import logger from 'utils/logger'
import assignPlayers from 'player-assignment/assignPlayers'
import db from 'db/mongodb'

const testAssignPlayers = async () => {
  const strategy = process.argv[2]

  if (!strategy || (strategy !== 'munkres' && strategy !== 'group')) {
    logger.error('Give strategy parameter, possible: "munkres", "group"')
    process.exit()
  }

  if (process.env.NODE_ENV === 'production') {
    logger.error(`Player allocation not allowed in production`)
    process.exit()
  }

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(error)
  }

  let users = []
  try {
    users = await db.user.findUsers()
  } catch (error) {
    logger.error(error)
  }

  let games = []
  try {
    games = await db.game.findGames()
  } catch (error) {
    logger.error(error)
  }

  const startingTime = '2018-07-27T15:00:00.000Z'

  await assignPlayers(users, games, startingTime, strategy)

  // const result = await assignPlayers(users, games, startingTime, strategy)
  // logger.info(`Result: ${JSON.stringify(result, null, 2)}`)

  process.exit()
}

testAssignPlayers()
