/* @flow */
import 'array-flat-polyfill'
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'

export const updateGamePopularity = async () => {
  logger.info('Calculate game popularity')

  try {
    await db.connectToDb()
  } catch (error) {
    logger.error(`db.connectToDb error: ${error}`)
  }

  let users = []
  try {
    users = await db.user.findUsers()
  } catch (error) {
    logger.error(`db.user.findUsers error: ${error}`)
  }

  let games = []
  try {
    games = await db.game.findGames()
  } catch (error) {
    logger.error(`db.user.findGames error: ${error}`)
  }

  const signedGames = users.flatMap(user =>
    user.signedGames.map(signedGames => signedGames.gameDetails)
  )

  const groupedSignups = signedGames.reduce((acc, game) => {
    acc[game.gameId] = ++acc[game.gameId] || 1
    return acc
  }, {})

  try {
    await Promise.all(
      games.map(async game => {
        if (groupedSignups[game.gameId]) {
          await db.game.updateGamePopularity(
            game.gameId,
            groupedSignups[game.gameId]
          )
        }
      })
    )
  } catch (error) {
    logger.error(`updateGamePopularity error: ${error}`)
    throw new Error('Update game popularity error')
  }

  logger.info('Game popularity updated')
}
