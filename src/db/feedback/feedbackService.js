/* @flow */
const { logger } = require('../../utils/logger')
const Feedback = require('./feedbackSchema')

const saveFeedback = async (feedbackData: Object) => {
  const feedback = new Feedback({
    game_id: feedbackData.id,
    feedback: feedbackData.feedback,
  })

  let response = null
  try {
    response = await feedback.save()
    logger.info(`MongoDB: Feedback saved successfully`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Feedback save error - ${error}`)
    return error
  }
}

module.exports = {
  saveFeedback,
}
