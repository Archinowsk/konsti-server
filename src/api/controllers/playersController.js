/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { assignPlayers } from 'player-assignment/assignPlayers'
import { validateAuthHeader } from 'utils/authHeader'
import { config } from 'config'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'
import type { Signup } from 'flow/result.flow'
import type { $Request, $Response, Middleware } from 'express'

// Assign players to games
const postPlayers: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/players')
  const startingTime = req.body.startingTime

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    return res.sendStatus(401)
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

      return res.json({
        message: 'Players assign success',
        status: 'success',
        results: assignResults.results,
        resultMessage: assignResults.message,
        signups: assignResults.newSignupData,
        startTime: startingTime,
      })
    } else {
      throw new Error('No matching assignments')
    }
  } catch (error) {
    logger.error(`Player assign error: ${error}`)
    return res.json({
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
