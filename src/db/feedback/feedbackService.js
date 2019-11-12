// @flow
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { FeedbackModel } from 'db/feedback/feedbackSchema';
import type { Feedback } from 'flow/feedback.flow';

const saveFeedback = async (feedbackData: Feedback): Promise<void> => {
  const feedback = new FeedbackModel({
    gameId: feedbackData.gameId,
    feedback: feedbackData.feedback,
  });

  const [error] = await to(feedback.save());
  if (error) throw new Error(`MongoDB: Feedback save error: ${error}`);

  logger.info(`MongoDB: Feedback saved successfully`);
};

export const feedback = {
  saveFeedback,
};
