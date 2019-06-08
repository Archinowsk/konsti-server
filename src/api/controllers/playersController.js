/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'
import assignPlayers from 'player-assignment/assignPlayers'
import validateAuthHeader from 'utils/authHeader'
import config from 'config'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Signup } from 'flow/result.flow'

// Assign players to games
const postPlayers = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/players')
  const startingTime = req.body.startingTime

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  const strategy = config.assignmentStrategy

  let users: $ReadOnlyArray<User> = []
  let games: $ReadOnlyArray<Game> = []

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

    const assignResults = assignPlayers(users, games, startingTime, strategy)

    if (assignResults && assignResults.results) {
      try {
        await db.results.saveResult(assignResults.results, startingTime)
      } catch (error) {
        logger.error(`saveResult error: ${error}`)
        throw new Error('No assign results')
      }

      try {
        await Promise.all(
          assignResults.results.map(assignResult => {
            return db.user.saveSignupResult(assignResult)
          })
        )
      } catch (error) {
        logger.error(`saveSignupResult error: ${error}`)
        throw new Error('No assign results')
      }

      // Remove overlapping signups
      if (assignResults.newSignupData) {
        await removeOverlappingSignups(assignResults.newSignupData)
      }

      res.json({
        message: 'Players assign success',
        status: 'success',
        results: assignResults,
      })
    } else {
      throw new Error('No matching assignments')
    }
  } catch (error) {
    logger.error(`Player assign error: ${error}`)
    res.json({
      message: 'Players assign failure',
      status: 'error',
      error,
    })
  }
}

const removeOverlappingSignups = async (signups: $ReadOnlyArray<Signup>) => {
  try {
    await Promise.all(
      signups.map(signup => {
        return db.user.saveSignup(signup)
      })
    )
  } catch (error) {
    logger.error(`saveSignup error: ${error}`)
    throw new Error('No assign results')
  }
}

export { postPlayers }
