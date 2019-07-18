/* @flow */
import 'array-flat-polyfill'
import moment from 'moment'
import _ from 'lodash'
import { logger } from 'utils/logger'
import { assignPlayers } from 'player-assignment/assignPlayers'
import { db } from 'db/mongodb'
import { config } from 'config'
import { saveResults } from 'api/controllers/playersController'
import type { AssignmentStrategy } from 'flow/config.flow'

const getAssignmentStategy = (userParameter: string): AssignmentStrategy => {
  if (
    userParameter === 'munkres' ||
    userParameter === 'group' ||
    userParameter === 'opa'
  ) {
    return userParameter
  } else {
    throw new Error('Unexpected assignment strategy')
  }
}

const testAssignPlayers = async (): Promise<any> => {
  const userParameter = process.argv[2]

  let assignmentStategy
  try {
    assignmentStategy = getAssignmentStategy(userParameter)
  } catch (error) {
    logger.error('Give strategy parameter, possible: "munkres", "group", "opa"')
    process.exit()
  }

  if (assignmentStategy) {
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

    const { CONVENTION_START_TIME } = config

    const startingTime = moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format()

    const assignResults = await assignPlayers(
      users,
      games,
      startingTime,
      assignmentStategy
    )

    try {
      await saveResults(assignResults.results, startingTime)
    } catch (error) {
      logger.error(`saveResult error: ${error}`)
    }

    // Verify entered games match signups
    logger.info('Verify entered games and signups match')
    let usersAfterAssign = []
    try {
      usersAfterAssign = await db.user.findUsers()
    } catch (error) {
      logger.error(error)
    }

    usersAfterAssign.map(user => {
      const enteredGames = user.enteredGames.filter(
        enteredGame =>
          moment(enteredGame.time).format() === moment(startingTime).format()
      )

      if (!enteredGames || enteredGames.length === 0) return

      if (enteredGames.length !== 1) {
        logger.error(
          `Too many entered games for time ${startingTime}: ${user.username} - ${enteredGames.length} games`
        )
        return
      }

      const enteredGame = _.first(enteredGames)

      if (user.signedGames && user.signedGames.length !== 0) {
        const signupFound = user.signedGames.find(signedGame => {
          return (
            signedGame.gameDetails.gameId === enteredGame.gameDetails.gameId &&
            moment(signedGame.time).format() ===
              moment(enteredGame.time).format()
          )
        })

        if (!signupFound) {
          logger.error(
            `Signup not found: ${user.username} - ${enteredGame.gameDetails.title}`
          )
        } else {
          logger.info(
            `Signup found: ${user.username} - ${enteredGame.gameDetails.title}`
          )
        }
      }
    })

    process.exit()
  }
}

testAssignPlayers()
