/* @flow */
import { logger } from '~/utils/logger'
import Feedback from '~/db/feedback/feedbackSchema'

const saveFeedback = async (feedbackData: Object) => {
  const feedback = new Feedback({
    gameId: feedbackData.id,
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

const feedback = {
  saveFeedback,
}
export default feedback
