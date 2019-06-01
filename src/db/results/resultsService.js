/* @flow */
import moment from 'moment'
import logger from 'utils/logger'
import Results from 'db/results/resultsSchema'
import type { Result } from 'flow/result.flow'

const removeResults = () => {
  logger.info('MongoDB: remove ALL results from db')
  return Results.deleteMany({})
}

const findResult = async (startTime: string) => {
  let response = null
  try {
    response = await Results.findOne({ startTime })
      .lean()
      .sort({ created: -1 })
      .populate('result.enteredGame')
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
  signupResultData: Array<Result>,
  startingTime: Date
) => {
  const result = signupResultData.map(result => {
    return {
      username: result.username,
      enteredGame: result.enteredGame._id,
      signedGames: result.signedGames.map(game => {
        return {
          gameDetails: game.gameDetails._id,
          priority: game.priority,
          time: game.time,
        }
      }),
    }
  })

  const results = new Results({
    result,
    startTime: moment(startingTime),
  })

  let response = null
  try {
    response = await results.save()
    logger.info(`MongoDB: Signup results stored to separate collection`)
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup results to separate collection - ${error}`
    )
    return error
  }
}

const results = { removeResults, saveResult, findResult }

export default results
