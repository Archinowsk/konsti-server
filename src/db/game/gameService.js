// @flow
import _ from 'lodash'
import moment from 'moment'
import { logger } from 'utils/logger'
import { Game } from 'db/game/gameSchema'
import { db } from 'db/mongodb'
import type { KompassiGame } from 'flow/game.flow'

const removeGames = async (): Promise<any> => {
  logger.info('MongoDB: remove ALL games from db')
  try {
    return await Game.deleteMany({})
  } catch (error) {
    logger.error(`MongoDB: Error removing games - ${error}`)
    return error
  }
}

const removeDeletedGames = async (
  updatedGames: $ReadOnlyArray<Game>
): Promise<any> => {
  const currentGames = await findGames()

  const deletedGames = _.differenceBy(currentGames, updatedGames, 'gameId')

  if (deletedGames && deletedGames.length !== 0) {
    logger.info(`Found ${deletedGames.length} deleted games, remove...`)

    try {
      await Promise.all(
        deletedGames.map(async deletedGame => {
          await Game.deleteOne({ gameId: deletedGame.gameId })
        })
      )
    } catch (error) {
      logger.error(`Error removing deleted games: ${error}`)
      return Promise.reject(error)
    }

    await removeDeletedGamesFromUsers()
  }
}

const removeMovedGamesFromUsers = async (
  updatedGames: $ReadOnlyArray<Game>
): Promise<any> => {
  logger.info('Remove moved games from users')
  const currentGames = await findGames()

  const movedGames = currentGames.filter(currentGame => {
    return updatedGames.find(updatedGame => {
      return (
        currentGame.gameId === updatedGame.gameId &&
        moment(currentGame.startTime).format() !==
          moment(updatedGame.startTime).format()
      )
    })
  })

  if (!movedGames || movedGames.length === 0) return

  logger.info(`Found ${movedGames.length} moved games`)

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
          const movedFound = movedGames.find(movedGame => {
            return movedGame.gameId === signedGame.gameDetails.gameId
          })
          if (!movedFound) {
            return signedGame
          }
        })

        const enteredGames = user.enteredGames.filter(enteredGame => {
          const movedFound = movedGames.find(movedGame => {
            return movedGame.gameId === enteredGame.gameDetails.gameId
          })
          if (!movedFound) {
            return enteredGame
          }
        })

        if (
          user.signedGames.length !== signedGames.length ||
          user.enteredGames.length !== enteredGames.length
        ) {
          await db.user.updateUser({
            ...user,
            signedGames,
            enteredGames,
          })
        }
      })
    )
  } catch (error) {
    logger.error(`db.user.updateUser error: ${error}`)
    throw new Error('No assign results')
  }
}

export const removeDeletedGamesFromUsers = async () => {
  logger.info('Remove deleted games from users')

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
          return signedGame.gameDetails
        })

        const enteredGames = user.enteredGames.filter(enteredGame => {
          return enteredGame.gameDetails
        })

        const favoritedGames = user.favoritedGames.filter(favoritedGame => {
          return favoritedGame
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
    throw new Error('No assign results')
  }
}

const saveGames = async (games: $ReadOnlyArray<KompassiGame>): Promise<any> => {
  logger.info('MongoDB: Store games to DB')

  const updatedGames = games.map(game => {
    return {
      gameId: game.identifier,
      title: game.title,
      description: game.description,
      location: game.room_name,
      startTime: moment(game.start_time).format(),
      mins: game.length,
      tags: game.tags,
      genres: game.genres,
      styles: game.styles,
      language: game.language,
      endTime: game.end_time,
      people: game.formatted_hosts,
      minAttendance: game.min_players,
      maxAttendance: game.max_players,
      gameSystem: game.rpg_system,
      englishOk: game.english_ok,
      childrenFriendly: game.children_friendly,
      ageRestricted: game.age_restricted,
      beginnerFriendly: game.beginner_friendly,
      intendedForExperiencedParticipants:
        game.intended_for_experienced_participants,
      shortDescription: game.short_blurb,
      revolvingDoor: game.revolving_door,
    }
  })

  await removeDeletedGames(updatedGames)
  await removeMovedGamesFromUsers(updatedGames)

  try {
    await Promise.all(
      updatedGames.map(async game => {
        await Game.updateOne(
          { gameId: game.gameId },
          {
            gameId: game.gameId,
            title: game.title,
            description: game.description,
            location: game.location,
            startTime: game.startTime,
            mins: game.mins,
            tags: game.tags,
            genres: game.genres,
            styles: game.styles,
            language: game.language,
            endTime: game.endTime,
            people: game.people,
            minAttendance: game.minAttendance,
            maxAttendance: game.maxAttendance,
            gameSystem: game.gameSystem,
            englishOk: game.englishOk,
            childrenFriendly: game.childrenFriendly,
            ageRestricted: game.ageRestricted,
            beginnerFriendly: game.beginnerFriendly,
            intendedForExperiencedParticipants:
              game.intendedForExperiencedParticipants,
            shortDescription: game.shortDescription,
            revolvingDoor: game.revolvingDoor,
          },
          {
            upsert: true,
            setDefaultsOnInsert: true,
          }
        )
      })
    )
  } catch (error) {
    logger.error(`Error saving games to db: ${error}`)
    return Promise.reject(error)
  }

  logger.debug('MongoDB: Games saved to DB succesfully')
  return findGames()
}

const findGames = async (): Promise<any> => {
  let response = null
  try {
    response = await Game.find({}).lean()
    logger.debug(`MongoDB: Find all games`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error fetcing games - ${error}`)
    return error
  }
}

const saveGamePopularity = async (
  gameId: string,
  popularity: number
): Promise<any> => {
  logger.debug(`MongoDB: Update game ${gameId} popularity to ${popularity}`)
  try {
    return await Game.updateOne(
      {
        gameId,
      },
      {
        popularity,
      }
    )
  } catch (error) {
    logger.errog(`Error updating game popularity: ${error}`)
  }
}

export const game = { saveGames, findGames, removeGames, saveGamePopularity }
