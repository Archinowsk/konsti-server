/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

export const updateWithSignups = async (
  users: Array<User>,
  games: Array<Game>
): Promise<void> => {
  const groupLeaders = users.filter(
    user => user.groupCode !== '0' && user.groupCode === user.serial
  )

  const allUsers = users.map(user => {
    const groupLeader = groupLeaders.find(
      groupLeader =>
        user.groupCode === groupLeader.groupCode &&
        user.serial !== groupLeader.serial
    )

    if (groupLeader) {
      return { ...user, signedGames: groupLeader.signedGames }
    } else return user
  })

  const signedGames = allUsers.flatMap(user =>
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
          await db.game.saveGamePopularity(
            game.gameId,
            groupedSignups[game.gameId]
          )
        }
      })
    )
  } catch (error) {
    logger.error(`saveGamePopularity error: ${error}`)
    throw new Error('Update game popularity error')
  }
}
