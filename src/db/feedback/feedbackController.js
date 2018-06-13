const { logger } = require('../../utils/logger')
const Feedback = require('./feedbackSchema')

const storeFeedbackData = async feedbackData => {
  // Example user data
  const feedback = new Feedback({
    game_id: feedbackData.id,
    feedback: feedbackData.feedback,
  })

  // Save to database
  let response = null
  try {
    response = await feedback.save()
    logger.info(`MongoDB: Feedback stored success`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Feedback stored error - ${error}`)
    return error
  }
}

module.exports = {
  storeFeedbackData,
}
