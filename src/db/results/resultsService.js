/* @flow */
import moment from 'moment'
import logger from 'utils/logger'
import Results from 'db/results/resultsSchema'
import type { Result } from 'flow/result.flow'

const removeResults = () => {
  logger.info('MongoDB: remove ALL results from db')
  return Results.deleteMany({})
}
const findResults = async (startTime: string) => {
  let response = null
  try {
    response = await Results.findOne({ startTime })
    logger.debug(`MongoDB: Results data found for time ${startTime}`)
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error finding results data for time ${startTime} - ${error}`
    )
    return error
  }
}

const saveAllSignupResults = async (
  signupResultData: Array<Result>,
  startingTime: Date
) => {
  const formattedTime = moment(startingTime)

  const results = new Results({
    result: signupResultData,
    startTime: formattedTime,
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

const results = { removeResults, saveAllSignupResults, findResults }

export default results
