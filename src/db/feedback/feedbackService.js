// @flow
import { logger } from 'utils/logger';
import { Feedback } from 'db/feedback/feedbackSchema';
import type { FeedbackData } from 'flow/feedback.flow';

const saveFeedback = async (feedbackData: FeedbackData): Promise<void> => {
  const feedback = new Feedback({
    gameId: feedbackData.gameId,
    feedback: feedbackData.feedback,
  });

  let response = null;
  try {
    response = await feedback.save();
    logger.info(`MongoDB: Feedback saved successfully`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Feedback save error - ${error}`);
    return error;
  }
};

export const feedback = {
  saveFeedback,
};
