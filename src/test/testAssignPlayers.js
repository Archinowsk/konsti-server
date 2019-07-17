/* @flow */
import 'array-flat-polyfill'
import moment from 'moment'
import { logger } from 'utils/logger'
import { assignPlayers } from 'player-assignment/assignPlayers'
import { db } from 'db/mongodb'
import { config } from 'config'
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

    await assignPlayers(users, games, startingTime, assignmentStategy)

    // Test that entered games match signups
    let usersAfterAssign = []
    try {
      usersAfterAssign = await db.user.findUsers()
    } catch (error) {
      logger.error(error)
    }

    usersAfterAssign.map(user => {
      const signedGames = user.signedGames.filter(
        signedGame =>
          moment(signedGame.time).format() === moment(startingTime).format()
      )

      const enteredGame = user.enteredGames.find(
        enteredGame =>
          moment(enteredGame.time).format() === moment(startingTime).format()
      )

      if (signedGames && signedGames.length !== 0 && enteredGame) {
        const gameFound = signedGames.find(
          signedGame =>
            signedGame.gameDetails.gameId === enteredGame.gameDetails.gameId
        )

        if (!gameFound) {
          logger.error(`Signups and entered game don't match`)
        }
      }
    })

    process.exit()
  }
}

testAssignPlayers()
