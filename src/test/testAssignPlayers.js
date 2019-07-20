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

const testAssignPlayers = async (): Promise<any> => {
  const { CONVENTION_START_TIME } = config
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

    await verifyUserSignups(startingTime)
    await verifyResults(startingTime)

    logger.info(assignResults.message)

    process.exit()
  }
}

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

const verifyUserSignups = async (startingTime: string) => {
  logger.info('Verify entered games and signups match for users')

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
          moment(signedGame.time).format() === moment(enteredGame.time).format()
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
}

const verifyResults = async (startingTime: string) => {
  logger.info('Verify results contain valid data')

  let results
  try {
    results = await db.results.findResult(startingTime)
  } catch (error) {
    logger.error(`Results: ${error}`)
  }

  if (!results || !results.result) {
    logger.error('No results found')
    return
  }

  results.result.map(result => {
    if (
      moment(result.enteredGame.time).format() !== moment(startingTime).format()
    ) {
      logger.error(
        `Invalid time for "${
          result.enteredGame.gameDetails.title
        }" - actual: ${moment(
          result.enteredGame.time
        ).format()}, expected: ${startingTime}`
      )
    }
  })
}

testAssignPlayers()
