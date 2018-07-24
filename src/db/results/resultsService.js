/* @flow */
import moment from 'moment'
import logger from '/utils/logger'
import Results from '/db/results/resultsSchema'

const removeResults = () => {
  logger.info('MongoDB: remove ALL results from db')
  return Results.remove({})
}
const findResults = async () => {
  let response = null
  try {
    response = await Results.find({})
    logger.info(`MongoDB: Results data found`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error finding results data - ${error}`)
    return error
  }
}

const saveAllSignupResults = async (
  signupResultData: Array<Object>,
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
