/* @flow */
import moment from 'moment'
import logger from '/utils/logger'
import db from '/db/mongodb'
import assignPlayers from '/player-assignment/assignPlayers'
import config from '/config'
import type { User } from '/flow/user.flow'
import type { Game } from '/flow/game.flow'

const runAssignPlayers = async () => {
  const strategy = config.assignmentStrategy

  const startingTime = moment('2018-07-27T15:00:00.000Z')
    .endOf('hour')
    .toDate()

  // '2018-07-27T15:00:00.000Z',
  // '2018-07-27T16:00:00.000Z',
  // const startingTime = '2018-07-27T15:00:00.000Z'

  let users: Array<User> = []
  let games: Array<Game> = []
  let assignResults: Array<Object> | null = []

  try {
    try {
      users = await db.user.findUsers()
    } catch (error) {
      logger.error(`findUsers error: ${error}`)
      throw new Error('No assign results')
    }

    try {
      games = await db.game.findGames()
    } catch (error) {
      logger.error(`findGames error: ${error}`)
      throw new Error('No assign results')
    }

    try {
      assignResults = assignPlayers(users, games, startingTime, strategy)
    } catch (error) {
      logger.error(`assignPlayers error: ${error}`)
      throw new Error('No assign results')
    }

    if (assignResults) {
      try {
        await db.results.saveAllSignupResults(assignResults, startingTime)
      } catch (error) {
        logger.error(`saveAllSignupResults error: ${error}`)
        throw new Error('No assign results')
      }

      try {
        await Promise.all(
          assignResults.map(assignResult => {
            return db.user.saveSignupResult(assignResult)
          })
        )
      } catch (error) {
        logger.error(`saveSignupResult error: ${error}`)
        throw new Error('No assign results')
      }
    } else {
      throw new Error('No matching assignments')
    }
  } catch (error) {
    logger.error(`Player assign error: ${error}`)
  }
}

export default runAssignPlayers
