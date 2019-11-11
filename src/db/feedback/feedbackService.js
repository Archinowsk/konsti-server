// @flow
import { logger } from 'utils/logger';
import { FeedbackModel } from 'db/feedback/feedbackSchema';
import type { Feedback } from 'flow/feedback.flow';

const saveFeedback = async (feedbackData: Feedback): Promise<void> => {
  const feedback = new FeedbackModel({
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
