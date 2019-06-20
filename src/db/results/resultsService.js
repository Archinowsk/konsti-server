/* @flow */
import { logger } from 'utils/logger'
import { Results } from 'db/results/resultsSchema'
import type { Result } from 'flow/result.flow'

const removeResults = () => {
  logger.info('MongoDB: remove ALL results from db')
  return Results.deleteMany({})
}

const findResult = async (startTime: string) => {
  let response = null
  try {
    response = await Results.findOne(
      { startTime },
      '-_id -__v -createdAt -updatedAt -result._id'
    )
      .lean()
      .sort({ createdAt: -1 })
      .populate('result.enteredGame.gameDetails')
      .populate('result.signedGames.gameDetails')
    logger.debug(`MongoDB: Results data found for time ${startTime}`)
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error finding results data for time ${startTime} - ${error}`
    )
    return error
  }
}

const saveResult = async (
  signupResultData: $ReadOnlyArray<Result>,
  startTime: string
) => {
  const result = signupResultData.map(result => {
    return {
      username: result.username,
      enteredGame: {
        gameDetails: result.enteredGame.gameDetails._id,
        priority: result.enteredGame.priority,
        time: result.enteredGame.time,
      },
      signedGames: result.signedGames.map(game => {
        return {
          gameDetails: game.gameDetails._id,
          priority: game.priority,
          time: game.time,
        }
      }),
    }
  })

  let response = null
  try {
    response = await Results.replaceOne(
      { startTime },
      { startTime, result },
      { upsert: true }
    )
    logger.info(
      `MongoDB: Signup results for starting time ${startTime} stored to separate collection`
    )
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup results for starting time ${startTime} to separate collection - ${error}`
    )
    return error
  }
}

export const results = { removeResults, saveResult, findResult }
