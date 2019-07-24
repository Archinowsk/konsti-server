/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'
import type { Game } from 'flow/game.flow'

// Add hidden data to server settings
const postHidden: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/hidden')
  const hiddenData = req.body.hiddenData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    return res.sendStatus(401)
  }

  let settings = null
  try {
    settings = await db.settings.saveHidden(hiddenData)
  } catch (error) {
    logger.error(`db.settings.saveHidden error: ${error}`)
    return res.json({
      message: 'Update hidden failure',
      status: 'error',
      error,
    })
  }

  try {
    removeHiddenGamesFromUsers(settings.hiddenGames)
  } catch (error) {
    logger.error(`removeHiddenGamesFromUsers error: ${error}`)
    return res.json({
      message: 'Update hidden failure',
      status: 'error',
      error,
    })
  }

  return res.json({
    message: 'Update hidden success',
    status: 'success',
    hiddenGames: settings.hiddenGames,
  })
}

const removeHiddenGamesFromUsers = async (
  hiddenGames: $ReadOnlyArray<Game>
): Promise<any> => {
  logger.info(`Remove hidden games from users`)

  if (!hiddenGames || hiddenGames.length === 0) return

  logger.info(`Found ${hiddenGames.length} hidden games`)

  let users = null
  try {
    users = await db.user.findUsers()
  } catch (error) {
    logger.error(`findUsers error: ${error}`)
    return Promise.reject(error)
  }

  try {
    await Promise.all(
      users.map(async user => {
        const signedGames = user.signedGames.filter(signedGame => {
          return hiddenGames.find(hiddenGame => {
            return hiddenGame.gameId !== signedGame.gameDetails.gameId
          })
        })

        const enteredGames = user.enteredGames.filter(enteredGame => {
          return hiddenGames.find(hiddenGame => {
            return hiddenGame.gameId !== enteredGame.gameDetails.gameId
          })
        })

        const favoritedGames = user.favoritedGames.filter(favoritedGame => {
          return hiddenGames.find(hiddenGame => {
            return hiddenGame.gameId !== favoritedGame.gameId
          })
        })

        if (
          user.signedGames.length !== signedGames.length ||
          user.enteredGames.length !== enteredGames.length ||
          user.favoritedGames.length !== favoritedGames.length
        ) {
          await db.user.updateUser({
            ...user,
            signedGames,
            enteredGames,
            favoritedGames,
          })
        }
      })
    )
  } catch (error) {
    logger.error(`db.user.updateUser error: ${error}`)
  }

  logger.info(`Hidden games removed from users`)
}

export { postHidden }
